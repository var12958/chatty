const { embedText } = require('./embedder');
const { searchSimilar } = require('./vectorStore');

// Minimum similarity score to be considered relevant
const MIN_SIMILARITY_THRESHOLD = 0.1;

const retrieveRelevantChunks = async (sessionId, userQuestion, topK = 5) => {
  try {
    // Embed the user question
    console.log(`Retrieving chunks for: "${userQuestion}"`);
    const questionVector = await embedText(userQuestion);

    // Search vector store
    const results = searchSimilar(sessionId, questionVector, topK);

    if (!results || results.length === 0) {
      console.warn('⚠️ No chunks retrieved');
      return { chunks: [], isOutOfScope: true };
    }

    // Filter by minimum similarity threshold
    const relevant = results.filter(r => r.similarity >= MIN_SIMILARITY_THRESHOLD);

    if (relevant.length === 0) {
      console.warn(`⚠️ All chunks below threshold (${MIN_SIMILARITY_THRESHOLD}) — out of scope`);
      return { chunks: [], isOutOfScope: true };
    }

    console.log(`✓ Retrieved ${relevant.length} relevant chunks`);
    relevant.forEach(r =>
      console.log(`  → "${r.title}" | similarity: ${r.similarity.toFixed(3)}`)
    );

    return { chunks: relevant, isOutOfScope: false };

  } catch (err) {
    console.error('Retrieval error:', err.message);
    throw new Error('Failed to retrieve relevant chunks');
  }
};

module.exports = { retrieveRelevantChunks };