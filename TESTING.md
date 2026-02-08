# Testing Guide

This guide explains how to test the Seconde Main application.

## Prerequisites

- Docker and Docker Compose installed and running
- All services started with `./start.sh` or `docker compose up`

## Quick Test

Run the automated test script:
```bash
./test.sh
```

## Manual Testing

### 1. Check Service Health

Test all services are running:

```bash
# API Gateway
curl http://localhost:4000/health

# User Service
curl http://localhost:4001/health

# Search Service
curl http://localhost:4002/health

# Scraper Service
curl http://localhost:4003/health
```

All should return `{"status":"ok","service":"..."}`

### 2. Populate Database

Add sample products to the database:

```bash
curl -X POST http://localhost:4000/api/scraper/run
```

Expected response: `{"message":"Scraping completed","productsAdded":20}`

### 3. Test Product Search

Search all products:
```bash
curl "http://localhost:4000/api/search"
```

Search with filters:
```bash
# Search by category
curl "http://localhost:4000/api/search?category=electronics"

# Search by price range
curl "http://localhost:4000/api/search?minPrice=100&maxPrice=500"

# Search by condition
curl "http://localhost:4000/api/search?condition=excellent"

# Search by location
curl "http://localhost:4000/api/search?location=Paris"

# Combined filters
curl "http://localhost:4000/api/search?query=laptop&category=electronics&minPrice=400&maxPrice=1000&condition=excellent"
```

### 4. Test User Registration

Register a new user:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Expected response includes `user` object and `token`.

Save the token for next steps:
```bash
TOKEN="your-token-here"
```

### 5. Test User Login

Login with existing user:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 6. Test Favorites (Requires Authentication)

Add to favorites:
```bash
curl -X POST http://localhost:4000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "product-1",
    "productData": {
      "title": "iPhone 12 Pro",
      "price": 599,
      "category": "electronics"
    }
  }'
```

Get favorites:
```bash
curl http://localhost:4000/api/favorites \
  -H "Authorization: Bearer $TOKEN"
```

Remove from favorites:
```bash
curl -X DELETE http://localhost:4000/api/favorites/product-1 \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Test Frontend

Open the frontend in your browser:
```
http://localhost:3000
```

Test the following:
1. Search for products using various filters
2. Register a new account
3. Login with your account
4. Add products to favorites
5. View your favorites page
6. Remove products from favorites
7. Logout and verify you can't access favorites

## Common Issues

### Services won't start
- Check Docker is running: `docker ps`
- Check logs: `docker compose logs`
- Restart services: `docker compose restart`

### Database connection errors
- Wait 30 seconds after starting services
- PostgreSQL needs time to initialize
- Check logs: `docker compose logs postgres`

### Elasticsearch errors
- Elasticsearch needs more memory
- Check logs: `docker compose logs elasticsearch`
- Increase Docker memory limit to at least 4GB

### Frontend can't connect to API
- Check REACT_APP_API_URL environment variable
- Ensure API Gateway is running: `curl http://localhost:4000/health`
- Check browser console for CORS errors

## Performance Testing

Test search performance:
```bash
# Run multiple searches
for i in {1..10}; do
  curl -s "http://localhost:4000/api/search?query=test" > /dev/null
  echo "Search $i completed"
done
```

## Cleanup

Stop all services:
```bash
docker compose down
```

Remove all data (including volumes):
```bash
docker compose down -v
```
