const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

async function embedText(text) {
  const res = await cohere.embed({
    texts: [text],
    model: 'embed-english-v3.0',
    inputType: 'search_document'
  });
  return res.embeddings[0];
}

async function embedBatch(texts) {
  const results = [];
  const BATCH = 90; // cohere limit is 96
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH);
    const res = await cohere.embed({
      texts: batch,
      model: 'embed-english-v3.0',
      inputType: 'search_document'
    });
    results.push(...res.embeddings);
    if (i + BATCH < texts.length) await new Promise(r => setTimeout(r, 500));
  }
  return results;
}

// startup test
embedText('hello')
  .then(() => console.log('[Embedder] Cohere ready ✓'))
  .catch(e => console.error('[Embedder] Cohere failed:', e.message));

module.exports = { embedText, embedBatch };