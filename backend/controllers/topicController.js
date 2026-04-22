const { processTopic } = require('../utils/topicProcessor');
const { fetchContent } = require('../utils/fetcher');
const { filterSources } = require('../utils/sourceFilter');
const { chunkResults } = require('../utils/chunker');
const { embedBatch } = require('../utils/embedder');
const { createSession, storeChunks } = require('../utils/vectorStore');

const initializeTopic = async (req, res) => {
  try {
    const { topic, sessionId } = req.body;

    if (!topic || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields — topic and sessionId are required'
      });
    }

    console.log(`\n=== Initializing topic: "${topic}" ===`);

    // Step 1 — Process topic
    const processed = processTopic(topic);
    console.log(`Domain identified: ${processed.domain}`);

    // Step 2 — Fetch content
    const rawResults = await fetchContent(processed.normalized, processed.domain);
    if (!rawResults || rawResults.length === 0) {
      return res.status(404).json({
        error: 'Could not find relevant content for this topic. Try a more specific topic.'
      });
    }

    // Step 3 — Filter sources
    const filtered = filterSources(rawResults);
    if (!filtered || filtered.length === 0) {
      return res.status(404).json({
        error: 'Could not find quality content for this topic. Try a different topic.'
      });
    }

    // Step 4 — Chunk content
    const chunks = chunkResults(filtered);
    if (!chunks || chunks.length === 0) {
      return res.status(500).json({
        error: 'Failed to process content. Please try again.'
      });
    }

    // Step 5 — Embed chunks
    const texts = chunks.map(c => c.text);
    const embeddings = await embedBatch(texts);
    if (!embeddings || embeddings.length === 0) {
      return res.status(500).json({
        error: 'Failed to embed content. Please try again.'
      });
    }

    // Attach embeddings to chunks
    const embeddedChunks = chunks.map((chunk, idx) => ({
      ...chunk,
      embedding: embeddings[idx]
    }));

    // Step 6 — Create session and store chunks
    createSession(sessionId, processed.original, processed.domain);
    storeChunks(sessionId, embeddedChunks);

    console.log(`=== Topic initialized successfully ===\n`);

    return res.status(200).json({
      success: true,
      topic: processed.original,
      domain: processed.domain,
      chunksStored: embeddedChunks.length,
      sessionId
    });

  } catch (err) {
    console.error('Topic initialization error:', err.message);

    if (err.message.includes('too short') || err.message.includes('too long') || err.message.includes('Invalid topic')) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({
      error: 'Failed to initialize topic. Please try again.'
    });
  }
};

module.exports = { initializeTopic };