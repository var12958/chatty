const DOMAIN_MAP = {
  tech: [
    'python', 'javascript', 'react', 'node', 'coding', 'programming',
    'machine learning', 'ai', 'web development', 'database', 'sql',
    'typescript', 'java', 'c++', 'flutter', 'android', 'ios',
    'software', 'algorithm', 'data structure', 'computer science'
  ],
  finance: [
    'stock', 'trading', 'crypto', 'bitcoin', 'investment', 'forex',
    'personal finance', 'budgeting', 'mutual funds', 'shares', 'market',
    'economy', 'banking', 'tax', 'portfolio', 'dividend'
  ],
  food: [
    'cooking', 'recipe', 'baking', 'pasta', 'food', 'cuisine',
    'nutrition', 'diet', 'meal', 'chef', 'kitchen', 'ingredients',
    'vegetarian', 'vegan', 'dessert', 'breakfast', 'lunch', 'dinner'
  ],
  health: [
    'fitness', 'workout', 'yoga', 'meditation', 'mental health',
    'exercise', 'weight loss', 'wellness', 'running', 'gym',
    'muscle', 'calories', 'sleep', 'stress', 'anxiety'
  ],
  science: [
    'physics', 'chemistry', 'biology', 'astronomy', 'mathematics',
    'space', 'quantum', 'genetics', 'ecology', 'geology',
    'nasa', 'planet', 'solar', 'atom', 'molecule', 'evolution'
  ],
  news: [
    'news', 'current events', 'politics', 'world', 'latest',
    'today', 'breaking', 'headlines', 'economy news', 'sports news'
  ]
};

// Clean and normalize raw topic input
const normalizeTopic = (rawTopic) => {
  if (!rawTopic || typeof rawTopic !== 'string') {
    throw new Error('Invalid topic — must be a non-empty string');
  }

  const cleaned = rawTopic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');

  if (cleaned.length < 3) {
    throw new Error('Topic too short — please be more specific');
  }

  if (cleaned.length > 100) {
    throw new Error('Topic too long — keep it under 100 characters');
  }

  return cleaned;
};

// Identify domain from normalized topic
const identifyDomain = (normalizedTopic) => {
  let bestMatch = null;
  let bestScore = 0;

  for (const [domain, keywords] of Object.entries(DOMAIN_MAP)) {
    const score = keywords.filter(keyword =>
      normalizedTopic.includes(keyword)
    ).length;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = domain;
    }
  }

  // If no match found fall back to general
  return bestMatch || 'general';
};

// Main processor
const processTopic = (rawTopic) => {
  const normalized = normalizeTopic(rawTopic);
  const domain = identifyDomain(normalized);

  console.log(`Topic processed: "${normalized}" → Domain: ${domain}`);

  return {
    original: rawTopic.trim(),
    normalized,
    domain
  };
};

module.exports = { processTopic };