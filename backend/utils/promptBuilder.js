// Build strict grounded prompt for Gemini
const buildGroundedPrompt = (topic, domain, topChunks, conversationHistory, userQuestion) => {
  // Format context from top chunks
  const context = topChunks
    .map((chunk, idx) => `[Source ${idx + 1}: ${chunk.source} — ${chunk.title}]\n${chunk.text}`)
    .join('\n\n');

  // Format conversation history
  const history = conversationHistory && conversationHistory.length > 0
    ? conversationHistory
        .map(m => `${m.type === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
        .join('\n')
    : '';

  return `
You are a specialized AI assistant focused exclusively on: "${topic}" (domain: ${domain}).

CONTEXT FROM TRUSTED SOURCES:
${context}

STRICT RULES — YOU MUST FOLLOW THESE:
1. Answer ONLY using the context provided above
2. Do NOT use your own prior knowledge or training data
3. If the answer is not found in the context above, respond EXACTLY with:
   "⚠️ I could not find relevant information about that in my knowledge base for ${topic}. Please ask something more specific to this topic."
4. Never make up facts, statistics, or information
5. Always keep your answer focused on "${topic}"
6. If the question is completely unrelated to "${topic}", respond EXACTLY with:
   "⚠️ That's outside my scope. I'm only able to help with ${topic}."
7. Cite which source you used at the end of your answer like: (Source: Wikipedia)

${history ? `CONVERSATION HISTORY:\n${history}\n` : ''}

User Question: ${userQuestion}
Assistant:`.trim();
};

// Build out of scope response
const buildOutOfScopeResponse = (topic) => {
  return `⚠️ I could not find relevant information about that in my knowledge base for "${topic}". Please ask something more specific to this topic.`;
};

module.exports = { buildGroundedPrompt, buildOutOfScopeResponse };