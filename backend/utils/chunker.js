// Clean raw text from HTML and unwanted characters
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')        // remove HTML tags
    .replace(/&nbsp;/g, ' ')          // replace HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')             // collapse whitespace
    .replace(/[^\x20-\x7E]/g, ' ')   // remove non-ASCII
    .trim();
};

// Split text into chunks of target word count
const splitIntoChunks = (text, chunkSize = 200, overlap = 50) => {
  const words = text.split(' ').filter(w => w.length > 0);
  const chunks = [];

  if (words.length <= chunkSize) {
    return [text]; // too short to chunk
  }

  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(' ');
    if (chunk.trim().length > 50) {
      chunks.push(chunk.trim());
    }
    start += chunkSize - overlap; // slide with overlap
  }

  return chunks;
};

// Process all filtered results into chunks
const chunkResults = (filteredResults) => {
  if (!filteredResults || filteredResults.length === 0) {
    console.warn('⚠️ No results to chunk');
    return [];
  }

  const allChunks = [];

  filteredResults.forEach((result, idx) => {
    const cleaned = cleanText(result.content);
    if (!cleaned || cleaned.length < 50) return;

    const chunks = splitIntoChunks(cleaned);

    chunks.forEach((chunk, chunkIdx) => {
      allChunks.push({
        id: `doc_${idx}_chunk_${chunkIdx}`,
        text: chunk,
        source: result.source,
        title: result.title,
        url: result.url,
        credibility: result.credibility
      });
    });
  });

  console.log(`✓ Created ${allChunks.length} chunks from ${filteredResults.length} sources`);
  return allChunks;
};

module.exports = { chunkResults };