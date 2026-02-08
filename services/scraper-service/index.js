require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4003;
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL || 'http://localhost:4002';

// Middleware
app.use(express.json());

// Mock data for second-hand products
const mockProducts = [
  // Electronics
  { 
    title: 'iPhone 12 Pro', 
    description: 'Excellent condition, barely used, includes charger', 
    price: 599, 
    category: 'electronics', 
    condition: 'excellent', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=iPhone+12+Pro',
    source: 'Leboncoin'
  },
  { 
    title: 'MacBook Air M1', 
    description: 'Great laptop, 8GB RAM, 256GB SSD', 
    price: 850, 
    category: 'electronics', 
    condition: 'good', 
    location: 'Lyon',
    imageUrl: 'https://via.placeholder.com/300x200/999999/FFFFFF?text=MacBook+Air',
    source: 'Vinted'
  },
  { 
    title: 'Samsung Galaxy S21', 
    description: 'Good condition, small scratch on back', 
    price: 400, 
    category: 'electronics', 
    condition: 'good', 
    location: 'Marseille',
    imageUrl: 'https://via.placeholder.com/300x200/1A1A1A/FFFFFF?text=Galaxy+S21',
    source: 'Leboncoin'
  },
  { 
    title: 'iPad Pro 11"', 
    description: 'Like new, with Apple Pencil', 
    price: 650, 
    category: 'electronics', 
    condition: 'excellent', 
    location: 'Toulouse',
    imageUrl: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=iPad+Pro',
    source: 'eBay'
  },
  { 
    title: 'Sony WH-1000XM4 Headphones', 
    description: 'Noise-cancelling, great sound', 
    price: 220, 
    category: 'electronics', 
    condition: 'good', 
    location: 'Nice',
    imageUrl: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Sony+Headphones',
    source: 'Vinted'
  },
  
  // Furniture
  { 
    title: 'IKEA Sofa', 
    description: 'Comfortable 3-seater sofa, gray color', 
    price: 180, 
    category: 'furniture', 
    condition: 'fair', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=IKEA+Sofa',
    source: 'Leboncoin'
  },
  { 
    title: 'Oak Dining Table', 
    description: 'Solid oak, seats 6 people', 
    price: 300, 
    category: 'furniture', 
    condition: 'good', 
    location: 'Bordeaux',
    imageUrl: 'https://via.placeholder.com/300x200/D2691E/FFFFFF?text=Dining+Table',
    source: 'Leboncoin'
  },
  { 
    title: 'Vintage Armchair', 
    description: 'Mid-century design, reupholstered', 
    price: 250, 
    category: 'furniture', 
    condition: 'excellent', 
    location: 'Lyon',
    imageUrl: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Armchair',
    source: 'Selency'
  },
  { 
    title: 'Bookshelf', 
    description: 'Tall white bookshelf, IKEA Billy', 
    price: 45, 
    category: 'furniture', 
    condition: 'good', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/FFFFFF/000000?text=Bookshelf',
    source: 'Leboncoin'
  },
  
  // Clothing
  { 
    title: 'Nike Air Max Sneakers', 
    description: 'Size 42, worn a few times', 
    price: 75, 
    category: 'clothing', 
    condition: 'good', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/FF6B00/FFFFFF?text=Nike+Air+Max',
    source: 'Vinted'
  },
  { 
    title: 'Levi\'s Jeans', 
    description: '501 model, size 32/32', 
    price: 40, 
    category: 'clothing', 
    condition: 'good', 
    location: 'Marseille',
    imageUrl: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=Levis+Jeans',
    source: 'Vinted'
  },
  { 
    title: 'Leather Jacket', 
    description: 'Black leather, size M', 
    price: 120, 
    category: 'clothing', 
    condition: 'excellent', 
    location: 'Lyon',
    imageUrl: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Leather+Jacket',
    source: 'Vinted'
  },
  { 
    title: 'Zara Winter Coat', 
    description: 'Women\'s coat, size S, warm', 
    price: 60, 
    category: 'clothing', 
    condition: 'good', 
    location: 'Toulouse',
    imageUrl: 'https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Winter+Coat',
    source: 'Vinted'
  },
  
  // Sports
  { 
    title: 'Mountain Bike', 
    description: 'Trek 29er, 21 speeds, excellent condition', 
    price: 450, 
    category: 'sports', 
    condition: 'excellent', 
    location: 'Grenoble',
    imageUrl: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Mountain+Bike',
    source: 'Leboncoin'
  },
  { 
    title: 'Tennis Racket', 
    description: 'Wilson Pro Staff, barely used', 
    price: 90, 
    category: 'sports', 
    condition: 'excellent', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/FFFF00/000000?text=Tennis+Racket',
    source: 'Leboncoin'
  },
  { 
    title: 'Yoga Mat', 
    description: 'Thick yoga mat, purple color', 
    price: 20, 
    category: 'sports', 
    condition: 'good', 
    location: 'Nice',
    imageUrl: 'https://via.placeholder.com/300x200/800080/FFFFFF?text=Yoga+Mat',
    source: 'Vinted'
  },
  
  // Books
  { 
    title: 'Harry Potter Collection', 
    description: 'Complete series, French version', 
    price: 45, 
    category: 'books', 
    condition: 'good', 
    location: 'Paris',
    imageUrl: 'https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Harry+Potter',
    source: 'Leboncoin'
  },
  { 
    title: 'Programming Books Bundle', 
    description: 'JavaScript, Python, React - 5 books', 
    price: 60, 
    category: 'books', 
    condition: 'excellent', 
    location: 'Lyon',
    imageUrl: 'https://via.placeholder.com/300x200/0066CC/FFFFFF?text=Programming+Books',
    source: 'Leboncoin'
  },
  
  // Home & Garden
  { 
    title: 'Coffee Machine Nespresso', 
    description: 'Delonghi model, works perfectly', 
    price: 80, 
    category: 'home', 
    condition: 'good', 
    location: 'Bordeaux',
    imageUrl: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Nespresso',
    source: 'Leboncoin'
  },
  { 
    title: 'Garden Tools Set', 
    description: 'Complete set with rake, shovel, etc.', 
    price: 35, 
    category: 'home', 
    condition: 'fair', 
    location: 'Toulouse',
    imageUrl: 'https://via.placeholder.com/300x200/228B22/FFFFFF?text=Garden+Tools',
    source: 'Leboncoin'
  }
];

// Generate unique IDs and URLs
const generateProducts = () => {
  return mockProducts.map((product, index) => ({
    ...product,
    id: `product-${index + 1}`,
    url: `https://example.com/product-${index + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
  }));
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'scraper-service' });
});

// Trigger scraping (populate database)
app.post('/api/scraper/run', async (req, res) => {
  try {
    const products = generateProducts();

    // Send products to search service
    await axios.post(`${SEARCH_SERVICE_URL}/api/products/bulk`, {
      products
    });

    res.json({ 
      message: 'Scraping completed', 
      productsAdded: products.length 
    });
  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

// Get mock products (for testing)
app.get('/api/scraper/products', (req, res) => {
  const products = generateProducts();
  res.json({ products, total: products.length });
});

app.listen(PORT, () => {
  console.log(`Scraper service running on port ${PORT}`);
});
