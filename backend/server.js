const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Routes
const chatRoutes = require('./routes/chat');
const topicRoutes = require('./routes/topic');

app.use('/api', chatRoutes);
app.use('/api/topic', topicRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// Unknown route handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Backend running at http://localhost:${PORT}`);
  console.log(`✓ Gemini API key: ${process.env.GEMINI_API_KEY ? 'Loaded' : 'MISSING'}`);
  console.log(`✓ News API key: ${process.env.NEWS_API_KEY ? 'Loaded' : 'MISSING'}`);
  console.log(`✓ Alpha Vantage key: ${process.env.ALPHA_VANTAGE_KEY ? 'Loaded' : 'MISSING'}`);
  console.log(`✓ Spoonacular key: ${process.env.SPOONACULAR_KEY ? 'Loaded' : 'MISSING'}`);
  console.log(`✓ NASA key: ${process.env.NASA_API_KEY ? 'Loaded' : 'MISSING'}`);
  console.log(`✓ Nutritionix: ${process.env.NUTRITIONIX_APP_KEY ? 'Loaded' : 'MISSING'}`);
});