const DOMAIN_API_MAP = {
  tech: {
    name: 'stackoverflow',
    url: (topic) =>
      `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodeURIComponent(topic)}&site=stackoverflow&pagesize=5`,
    requiresKey: false
  },
  finance: {
    name: 'alphavantage',
    url: (topic) =>
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(topic)}&apikey=${process.env.ALPHA_VANTAGE_KEY}`,
    requiresKey: true,
    keyName: 'ALPHA_VANTAGE_KEY'
  },
  food: {
    name: 'spoonacular',
    url: (topic) =>
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(topic)}&number=5&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_KEY}`,
    requiresKey: true,
    keyName: 'SPOONACULAR_KEY'
  },
  science: {
    name: 'nasa',
    url: (topic) =>
      `https://images-api.nasa.gov/search?q=${encodeURIComponent(topic)}&media_type=image&page_size=5`,
    requiresKey: false
  },
  news: {
    name: 'newsapi',
    url: (topic) =>
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=5&sortBy=relevancy&apiKey=${process.env.NEWS_API_KEY}`,
    requiresKey: true,
    keyName: 'NEWS_API_KEY'
  },
  health: {
  name: 'wger',
  url: (topic) =>
    `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(topic)}&language=english&format=json`,
  requiresKey: false
},
  general: {
    name: 'wikipedia',
    url: (topic) =>
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
    requiresKey: false
  }
};

// Wikipedia fallback — always available
const WIKIPEDIA_FALLBACK = {
  name: 'wikipedia',
  url: (topic) =>
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`,
  requiresKey: false
};

// Check if required API key exists in .env
const isKeyAvailable = (api) => {
  if (!api.requiresKey) return true;
  const key = process.env[api.keyName];
  return key && key.trim() !== '';
};

// Select the right API for the domain
const selectAPI = (domain) => {
  const selectedAPI = DOMAIN_API_MAP[domain] || DOMAIN_API_MAP['general'];

  // Check if API key is available
  if (!isKeyAvailable(selectedAPI)) {
    console.warn(
      `⚠️ API key missing for ${selectedAPI.name} — falling back to Wikipedia`
    );
    return {
      primary: WIKIPEDIA_FALLBACK,
      fallback: WIKIPEDIA_FALLBACK,
      usingFallback: true
    };
  }

  console.log(`✓ API selected: ${selectedAPI.name} for domain: ${domain}`);

  return {
    primary: selectedAPI,
    fallback: WIKIPEDIA_FALLBACK,
    usingFallback: false
  };
};

module.exports = { selectAPI };