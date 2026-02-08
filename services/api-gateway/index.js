require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:4001';
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:4002';
const SCRAPER_SERVICE_URL = process.env.SCRAPER_SERVICE_URL || 'http://localhost:4003';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Proxy middleware
const proxy = (serviceUrl) => {
  return async (req, res) => {
    try {
      const response = await axios({
        method: req.method,
        url: `${serviceUrl}${req.path}`,
        data: req.body,
        headers: {
          ...req.headers,
          host: new URL(serviceUrl).host
        }
      });
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: 'Service unavailable' });
      }
    }
  };
};

// Routes
app.use('/api/users', proxy(USER_SERVICE_URL));
app.use('/api/auth', proxy(USER_SERVICE_URL));
app.use('/api/favorites', proxy(USER_SERVICE_URL));
app.use('/api/products', proxy(SEARCH_SERVICE_URL));
app.use('/api/search', proxy(SEARCH_SERVICE_URL));
app.use('/api/scraper', proxy(SCRAPER_SERVICE_URL));

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
