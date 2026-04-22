// Re-rank retrieved chunks for better precision
// Uses a combination of similarity score + content quality signals

const rerankChunks = (chunks, userQuestion, topK = 3) => {
  if (!chunks || chunks.length === 0) return [];

  const questionWords = userQuestion
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(w => w.length > 2);

  const reranked = chunks.map(chunk => {
    let finalScore = chunk.similarity * 10; // base score from similarity

    const chunkTextLower = chunk.text.toLowerCase();

    // Bonus — exact keyword matches in chunk
    const keywordMatches = questionWords.filter(word =>
      chunkTextLower.includes(word)
    ).length;
    finalScore += keywordMatches * 0.5;

    // Bonus — high credibility source
    if (chunk.credibility === 'high') finalScore += 1;

    // Bonus — longer content is usually more informative
    if (chunk.text.length > 300) finalScore += 0.5;

    // Penalty — very short chunks
    if (chunk.text.length < 100) finalScore -= 1;

    return { ...chunk, finalScore };
  });

  // Sort by final score
  const sorted = reranked.sort((a, b) => b.finalScore - a.finalScore);

  // Return top K
  const top = sorted.slice(0, topK);

  console.log(`✓ Re-ranked to top ${top.length} chunks`);
  top.forEach(r =>
    console.log(`  → "${r.title}" | finalScore: ${r.finalScore.toFixed(2)}`)
  );

  return top;
};

module.exports = { rerankChunks };
