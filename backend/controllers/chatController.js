const { GoogleGenerativeAI } = require('@google/generative-ai');
const { retrieveRelevantChunks } = require('../utils/retriever');
const { rerankChunks } = require('../utils/reranker');
const { buildGroundedPrompt, buildOutOfScopeResponse } = require('../utils/promptBuilder');
const { getSession, deleteSession } = require('../utils/vectorStore');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1'
});

const conversationHistories = {};

// Retry mechanism for rate-limited API calls
async function callGeminiWithRetry(prompt, retries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      const statusCode = err.status || err.message;
      const isRateLimit = statusCode === 429 || err.message?.includes('429') || err.message?.includes('rate limit');

      if (isRateLimit && attempt < retries) {
        console.log(`[Gemini] Rate limited — waiting 30 seconds (attempt ${attempt}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 30000));
        continue;
      }

      // Non-rate-limit errors throw immediately
      if (!isRateLimit) {
        throw err;
      }
    }
  }

  throw lastError;
}

const chat = async (req, res) => {
  try {
    const { userMessage, sessionId } = req.body;

    if (!userMessage || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields — userMessage and sessionId are required'
      });
    }

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found. Please create a new assistant.'
      });
    }

    const { topic, domain } = session;

    if (!conversationHistories[sessionId]) {
      conversationHistories[sessionId] = [];
    }
    const history = conversationHistories[sessionId];

    console.log(`\n=== Chat: "${userMessage}" ===`);

    // Step 1 — Retrieve relevant chunks
    const { chunks, isOutOfScope } = await retrieveRelevantChunks(
      sessionId,
      userMessage
    );

    // Step 2 — Out of scope check
    if (isOutOfScope) {
      const outOfScopeMsg = buildOutOfScopeResponse(topic);
      history.push({ type: 'user', text: userMessage });
      history.push({ type: 'ai', text: outOfScopeMsg });

      return res.status(200).json({
        reply: outOfScopeMsg,
        isOutOfScope: true,
        sessionId
      });
    }

    // Step 3 — Re-rank
    const topChunks = rerankChunks(chunks, userMessage, 3);

    // Step 4 — Build prompt
    const prompt = buildGroundedPrompt(
      topic,
      domain,
      topChunks,
      history,
      userMessage
    );

    // Step 5 — Small delay to avoid rate limit
    await new Promise(r => setTimeout(r, 2000));

    // Step 6 — Call Gemini with retry
    const reply = await callGeminiWithRetry(prompt);

    // Step 7 — Save history
    history.push({ type: 'user', text: userMessage });
    history.push({ type: 'ai', text: reply });

    if (history.length > 10) {
      conversationHistories[sessionId] = history.slice(-10);
    }

    console.log(`=== Response generated ===\n`);

    return res.status(200).json({
      reply,
      isOutOfScope: false,
      sources: topChunks.map(c => ({
        title: c.title,
        source: c.source,
        url: c.url
      })),
      sessionId
    });

  } catch (err) {
    console.error('Chat error:', err.message);

    const msg = err.message.toLowerCase();

    if (msg.includes('429') || msg.includes('quota') || msg.includes('rate') || msg.includes('limit')) {
      return res.status(429).json({
        error: 'Gemini API rate limit reached — please wait 30 seconds and try again'
      });
    }

    if (msg.includes('api key') || msg.includes('401') || msg.includes('403')) {
      return res.status(401).json({
        error: 'Invalid API key — check your .env file'
      });
    }

    if (msg.includes('404') || msg.includes('not found')) {
      return res.status(500).json({
        error: 'Gemini model not found — check model name'
      });
    }

    return res.status(500).json({
      error: 'Something went wrong — please try again'
    });
  }
};

const resetSession = (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    deleteSession(sessionId);
    delete conversationHistories[sessionId];

    return res.status(200).json({ message: 'Session cleared successfully' });

  } catch (err) {
    console.error('Reset error:', err.message);
    return res.status(500).json({ error: 'Failed to reset session' });
  }
};

module.exports = { chat, resetSession };