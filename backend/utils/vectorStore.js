// In-memory store — one vector store per session
const store = {};

// Cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
};

// Create a new session store
const createSession = (sessionId, topic, domain) => {
  store[sessionId] = {
    topic,
    domain,
    chunks: [],
    createdAt: Date.now()
  };
  console.log(`✓ Session created: ${sessionId}`);
};

// Store embedded chunks for a session
const storeChunks = (sessionId, embeddedChunks) => {
  if (!store[sessionId]) {
    throw new Error(`Session ${sessionId} not found`);
  }
  store[sessionId].chunks = embeddedChunks;
  console.log(`✓ Stored ${embeddedChunks.length} chunks in session ${sessionId}`);
};

// Search for top-k most similar chunks to a query vector
const searchSimilar = (sessionId, queryVector, topK = 5) => {
  if (!store[sessionId]) {
    throw new Error(`Session ${sessionId} not found`);
  }

  const chunks = store[sessionId].chunks;
  if (!chunks || chunks.length === 0) return [];

  // Score all chunks
  const scored = chunks.map(chunk => ({
    ...chunk,
    similarity: cosineSimilarity(queryVector, chunk.embedding)
  }));

  // Sort by similarity descending
  const sorted = scored.sort((a, b) => b.similarity - a.similarity);

  // Return top K
  return sorted.slice(0, topK);
};

// Get session info
const getSession = (sessionId) => store[sessionId] || null;

// Delete session on reset
const deleteSession = (sessionId) => {
  if (store[sessionId]) {
    delete store[sessionId];
    console.log(`✓ Session deleted: ${sessionId}`);
  }
};

// Cleanup old sessions older than 2 hours
const cleanupOldSessions = () => {
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const now = Date.now();
  let cleaned = 0;

  Object.keys(store).forEach(sessionId => {
    if (now - store[sessionId].createdAt > TWO_HOURS) {
      delete store[sessionId];
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`✓ Cleaned up ${cleaned} expired sessions`);
  }
};

// Auto cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);

module.exports = {
  createSession,
  storeChunks,
  searchSimilar,
  getSession,
  deleteSession
};