require('dotenv').config();
const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const PORT = process.env.PORT || 4002;

// Elasticsearch client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

const INDEX_NAME = 'products';

// Middleware
app.use(express.json());

// Initialize Elasticsearch index
const initElasticsearch = async () => {
  try {
    const indexExists = await esClient.indices.exists({ index: INDEX_NAME });

    if (!indexExists) {
      await esClient.indices.create({
        index: INDEX_NAME,
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              category: { type: 'keyword' },
              condition: { type: 'keyword' },
              location: { type: 'keyword' },
              imageUrl: { type: 'keyword' },
              source: { type: 'keyword' },
              url: { type: 'keyword' },
              createdAt: { type: 'date' }
            }
          }
        }
      });
      console.log('Elasticsearch index created');
    } else {
      console.log('Elasticsearch index already exists');
    }
  } catch (error) {
    console.error('Elasticsearch initialization error:', error);
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'search-service' });
});

// Add product
app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;

    await esClient.index({
      index: INDEX_NAME,
      id: product.id,
      body: product
    });

    await esClient.indices.refresh({ index: INDEX_NAME });

    res.status(201).json({ message: 'Product added', product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Bulk add products
app.post('/api/products/bulk', async (req, res) => {
  try {
    const products = req.body.products;

    const body = products.flatMap(product => [
      { index: { _index: INDEX_NAME, _id: product.id } },
      product
    ]);

    await esClient.bulk({ body });
    await esClient.indices.refresh({ index: INDEX_NAME });

    res.status(201).json({ message: 'Products added', count: products.length });
  } catch (error) {
    console.error('Error bulk adding products:', error);
    res.status(500).json({ error: 'Failed to add products' });
  }
});

// Search products
app.get('/api/search', async (req, res) => {
  try {
    const {
      query = '',
      category,
      minPrice,
      maxPrice,
      condition,
      location,
      page = 1,
      limit = 20
    } = req.query;

    const must = [];
    const filter = [];

    // Text search
    if (query) {
      must.push({
        multi_match: {
          query: query,
          fields: ['title^2', 'description'],
          fuzziness: 'AUTO'
        }
      });
    } else {
      must.push({ match_all: {} });
    }

    // Filters
    if (category) {
      filter.push({ term: { category } });
    }

    if (condition) {
      filter.push({ term: { condition } });
    }

    if (location) {
      filter.push({ term: { location } });
    }

    if (minPrice || maxPrice) {
      const range = { price: {} };
      if (minPrice) range.price.gte = parseFloat(minPrice);
      if (maxPrice) range.price.lte = parseFloat(maxPrice);
      filter.push({ range });
    }

    const from = (parseInt(page) - 1) * parseInt(limit);

    const result = await esClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          bool: { must, filter }
        },
        from,
        size: parseInt(limit),
        sort: [{ createdAt: { order: 'desc' } }]
      }
    });

    const products = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }));

    res.json({
      products,
      total: result.hits.total.value,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await esClient.get({
      index: INDEX_NAME,
      id
    });

    res.json({ id: result._id, ...result._source });
  } catch (error) {
    if (error.meta?.statusCode === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all categories
app.get('/api/products/categories', async (req, res) => {
  try {
    const result = await esClient.search({
      index: INDEX_NAME,
      body: {
        size: 0,
        aggs: {
          categories: {
            terms: { field: 'category', size: 100 }
          }
        }
      }
    });

    const categories = result.aggregations.categories.buckets.map(b => b.key);
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Start server and initialize Elasticsearch
initElasticsearch().then(() => {
  app.listen(PORT, () => {
    console.log(`Search service running on port ${PORT}`);
  });
});
