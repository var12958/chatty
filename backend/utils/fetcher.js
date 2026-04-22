const axios = require('axios');
const { selectAPI } = require('./apiSelector');

// Wikipedia specific fetcher
const fetchFromWikipedia = async (topic) => {
  try {
    // First try exact topic
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&srlimit=5`;
    const searchRes = await axios.get(searchUrl);
    const results = searchRes.data.query.search;

    if (!results || results.length === 0) {
      throw new Error('No Wikipedia results found');
    }

    // Fetch full summary for each result
    const pages = await Promise.all(
      results.slice(0, 3).map(async (result) => {
        const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(result.title)}`;
        const summaryRes = await axios.get(summaryUrl);
        return {
          title: summaryRes.data.title,
          content: summaryRes.data.extract,
          source: 'Wikipedia',
          url: summaryRes.data.content_urls?.desktop?.page || '',
          credibility: 'high'
        };
      })
    );

    return pages.filter(p => p.content && p.content.length > 100);

  } catch (err) {
    console.error('Wikipedia fetch error:', err.message);
    return [];
  }
};

// Stack Overflow fetcher
const fetchFromStackOverflow = async (topic) => {
  try {
    const url = `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&intitle=${encodeURIComponent(topic)}&site=stackoverflow&pagesize=10&filter=withbody`;
    const res = await axios.get(url);
    const items = res.data.items || [];

    return items.slice(0, 5).map(item => ({
      title: item.title,
      content: item.body
        ? item.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : item.title,
      source: 'Stack Overflow',
      url: item.link,
      credibility: 'high'
    }));

  } catch (err) {
    console.error('Stack Overflow fetch error:', err.message);
    return [];
  }
};

// Alpha Vantage fetcher
const fetchFromAlphaVantage = async (topic) => {
  try {
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${encodeURIComponent(topic)}&apikey=${process.env.ALPHA_VANTAGE_KEY}&limit=5`;
    const res = await axios.get(url);
    const feed = res.data.feed || [];

    return feed.slice(0, 3).map(item => ({
      title: item.title,
      content: item.summary,
      source: 'Alpha Vantage',
      url: item.url,
      credibility: 'high'
    }));

  } catch (err) {
    console.error('Alpha Vantage fetch error:', err.message);
    return [];
  }
};

// Spoonacular fetcher
const fetchFromSpoonacular = async (topic) => {
  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(topic)}&number=5&addRecipeInformation=true&apiKey=${process.env.SPOONACULAR_KEY}`;
    const res = await axios.get(url);
    const results = res.data.results || [];

    return results.slice(0, 3).map(item => ({
      title: item.title,
      content: item.summary
        ? item.summary.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
        : item.title,
      source: 'Spoonacular',
      url: item.sourceUrl || '',
      credibility: 'high'
    }));

  } catch (err) {
    console.error('Spoonacular fetch error:', err.message);
    return [];
  }
};

// NASA fetcher
const fetchFromNASA = async (topic) => {
  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(topic)}&media_type=image&page_size=5`;
    const res = await axios.get(url);
    const items = res.data.collection?.items || [];

    return items.slice(0, 3).map(item => ({
      title: item.data[0]?.title || topic,
      content: item.data[0]?.description || item.data[0]?.title || '',
      source: 'NASA',
      url: item.href || '',
      credibility: 'high'
    }));

  } catch (err) {
    console.error('NASA fetch error:', err.message);
    return [];
  }
};

// NewsAPI fetcher
const fetchFromNewsAPI = async (topic) => {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&pageSize=5&sortBy=relevancy&apiKey=${process.env.NEWS_API_KEY}`;
    const res = await axios.get(url);
    const articles = res.data.articles || [];

    return articles.slice(0, 3).map(item => ({
      title: item.title,
      content: item.content || item.description || '',
      source: item.source?.name || 'NewsAPI',
      url: item.url,
      credibility: 'medium'
    }));

  } catch (err) {
    console.error('NewsAPI fetch error:', err.message);
    return [];
  }
};

// Nutritionix fetcher
// Wger fetcher
const fetchFromWger = async (topic) => {
  try {
    const url = `https://wger.de/api/v2/exercise/search/?term=${encodeURIComponent(topic)}&language=english&format=json`;
    const res = await axios.get(url);
    const suggestions = res.data.suggestions || [];

    return suggestions.slice(0, 3).map(item => ({
      title: item.value,
      content: `${item.value} — Category: ${item.data?.category || 'fitness'}. ${item.data?.description || ''}`.trim(),
      source: 'Wger Fitness',
      url: 'https://wger.de',
      credibility: 'high'
    }));

  } catch (err) {
    console.error('Wger fetch error:', err.message);
    return [];
  }
};

// API fetcher router
const FETCHER_MAP = {
  stackoverflow: fetchFromStackOverflow,
  alphavantage: fetchFromAlphaVantage,
  spoonacular: fetchFromSpoonacular,
  nasa: fetchFromNASA,
  newsapi: fetchFromNewsAPI,
  wger: fetchFromWger,
  wikipedia: fetchFromWikipedia
};

// Main fetch function
const fetchContent = async (topic, domain) => {
  const { primary, fallback } = selectAPI(domain);

  console.log(`Fetching from: ${primary.name} for topic: "${topic}"`);

  // Try primary API first
  let results = [];
  const primaryFetcher = FETCHER_MAP[primary.name];

  if (primaryFetcher) {
    results = await primaryFetcher(topic);
  }

  // If primary failed or returned nothing → fallback to Wikipedia
  if (!results || results.length === 0) {
    console.warn(`⚠️ Primary API returned nothing — falling back to Wikipedia`);
    results = await fetchFromWikipedia(topic);
  }

  // If still nothing → return empty with error
  if (!results || results.length === 0) {
    console.error(`✗ All sources failed for topic: "${topic}"`);
    return [];
  }

  console.log(`✓ Fetched ${results.length} results for "${topic}"`);
  return results;
};

module.exports = { fetchContent };