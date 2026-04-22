// Minimum content length to be considered valid
const MIN_CONTENT_LENGTH = 50;

// Maximum content length to avoid token overload
const MAX_CONTENT_LENGTH = 3000;

// Credibility scores
const CREDIBILITY_SCORES = {
  high: 3,
  medium: 2,
  low: 1
};

// Low quality indicators — if content has these it gets penalized
const LOW_QUALITY_INDICATORS = [
  'click here',
  'subscribe now',
  'buy now',
  'advertisement',
  'sponsored',
  'cookie policy',
  'privacy policy',
  'terms of service',
  'sign up for free',
  'download now'
];

// High quality source indicators
const HIGH_QUALITY_SOURCES = [
  'wikipedia',
  'stack overflow',
  'nasa',
  'spoonacular',
  'alpha vantage',
  'nutritionix',
  'newsapi',
  'official',
  'docs',
  'documentation'
];

// Score a single result
const scoreResult = (result) => {
  let score = 0;

  // 1. Content length check
  if (!result.content || result.content.length < MIN_CONTENT_LENGTH) {
    return 0; // immediately discard
  }

  // 2. Credibility score
  score += CREDIBILITY_SCORES[result.credibility] || 1;

  // 3. High quality source bonus
  const sourceLower = (result.source || '').toLowerCase();
  const isHighQuality = HIGH_QUALITY_SOURCES.some(s => sourceLower.includes(s));
  if (isHighQuality) score += 2;

  // 4. Low quality indicator penalty
  const contentLower = (result.content || '').toLowerCase();
  const hasLowQuality = LOW_QUALITY_INDICATORS.some(indicator =>
    contentLower.includes(indicator)
  );
  if (hasLowQuality) score -= 2;

  // 5. Content richness — longer content scores better (up to a limit)
  if (result.content.length > 500) score += 1;
  if (result.content.length > 1000) score += 1;

  // 6. Has a valid URL — adds credibility
  if (result.url && result.url.startsWith('http')) score += 1;

  // 7. Has a proper title
  if (result.title && result.title.length > 5) score += 1;

  return score;
};

// Trim content to max length
const trimContent = (content) => {
  if (!content) return '';
  if (content.length <= MAX_CONTENT_LENGTH) return content;
  return content.substring(0, MAX_CONTENT_LENGTH) + '...';
};

// Remove duplicate content
const removeDuplicates = (results) => {
  const seen = new Set();
  return results.filter(result => {
    // Use first 100 chars as fingerprint
    const fingerprint = result.content.substring(0, 100).toLowerCase().trim();
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
};

// Main filter function
const filterSources = (results) => {
  if (!results || results.length === 0) {
    console.warn('⚠️ No results to filter');
    return [];
  }

  console.log(`Filtering ${results.length} raw results...`);

  // Step 1 — Score each result
  const scored = results.map(result => ({
    ...result,
    content: trimContent(result.content),
    score: scoreResult(result)
  }));

  // Step 2 — Remove zero score results
  const valid = scored.filter(r => r.score >= 0);

  // Step 3 — Remove duplicates
  const unique = removeDuplicates(valid);

  // Step 4 — Sort by score descending
  const sorted = unique.sort((a, b) => b.score - a.score);

  // Step 5 — Keep top 5 only
  const top = sorted.slice(0, 5);

  console.log(`✓ Filtered to ${top.length} quality results`);
  top.forEach(r => console.log(`  → ${r.source} | score: ${r.score} | "${r.title}"`));

  return top;
};

module.exports = { filterSources };