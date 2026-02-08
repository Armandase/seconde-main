# Developer Quick Start Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

## Quick Setup (5 minutes)

### 1. Clone and Start
```bash
git clone https://github.com/Armandase/seconde-main.git
cd seconde-main
./start.sh
```

### 2. Access the Application
- Frontend: http://localhost:3000
- API Gateway: http://localhost:4000

### 3. Test the Application
```bash
./test.sh
```

## Development Commands

### Docker Commands
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f frontend
docker compose logs -f api-gateway

# Restart a service
docker compose restart user-service

# Stop all services
docker compose down

# Remove all data
docker compose down -v
```

### Service URLs
| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React application |
| API Gateway | http://localhost:4000 | Main API endpoint |
| User Service | http://localhost:4001 | Auth & Favorites |
| Search Service | http://localhost:4002 | Product search |
| Scraper Service | http://localhost:4003 | Data population |
| PostgreSQL | localhost:5432 | User database |
| Elasticsearch | http://localhost:9200 | Product index |

## API Quick Reference

### Authentication
```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### Product Search
```bash
# Search all
curl http://localhost:4000/api/search

# Search with filters
curl "http://localhost:4000/api/search?category=electronics&minPrice=100&maxPrice=500"
```

### Favorites (requires token)
```bash
# Get favorites
curl http://localhost:4000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add favorite
curl -X POST http://localhost:4000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"product-1","productData":{"title":"Product"}}'
```

## Local Development (Without Docker)

### 1. Start Databases
```bash
# PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15-alpine

# Elasticsearch
docker run -d -p 9200:9200 -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

### 2. Start Backend Services
```bash
# Terminal 1 - API Gateway
cd services/api-gateway
npm install
npm start

# Terminal 2 - User Service
cd services/user-service
npm install
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/secondemain npm start

# Terminal 3 - Search Service
cd services/search-service
npm install
ELASTICSEARCH_URL=http://localhost:9200 npm start

# Terminal 4 - Scraper Service
cd services/scraper-service
npm install
npm start
```

### 3. Start Frontend
```bash
# Terminal 5
cd frontend
npm install
REACT_APP_API_URL=http://localhost:4000 npm start
```

## Project Structure
```
seconde-main/
├── services/
│   ├── api-gateway/      # API Gateway
│   ├── user-service/     # Auth & Favorites
│   ├── search-service/   # Product Search
│   └── scraper-service/  # Data Population
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
│   └── public/
├── docker-compose.yml    # Docker orchestration
├── start.sh             # Quick start script
├── test.sh              # Test script
└── README.md            # Documentation
```

## Common Tasks

### Populate Database with Sample Data
```bash
curl -X POST http://localhost:4000/api/scraper/run
```

### Check Service Health
```bash
curl http://localhost:4000/health
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
```

### View Database
```bash
# PostgreSQL
docker exec -it seconde-main-postgres psql -U postgres -d secondemain

# List tables
\dt

# View users
SELECT * FROM users;

# View favorites
SELECT * FROM favorites;
```

### Query Elasticsearch
```bash
# View all products
curl http://localhost:9200/products/_search

# Get product count
curl http://localhost:9200/products/_count
```

## Troubleshooting

### Services Won't Start
```bash
# Check Docker status
docker ps

# Check logs
docker compose logs

# Restart services
docker compose restart
```

### Database Connection Issues
```bash
# Wait for databases to initialize (30 seconds)
sleep 30

# Check PostgreSQL
docker exec seconde-main-postgres pg_isready

# Check Elasticsearch
curl http://localhost:9200/_cluster/health
```

### Frontend Can't Connect
- Check API Gateway is running: `curl http://localhost:4000/health`
- Verify REACT_APP_API_URL environment variable
- Check browser console for errors

### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :4000

# Kill process
kill -9 PID
```

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload in development mode
- Backend: Use `npm run dev` with nodemon for auto-restart

### Debug Mode
```bash
# Node.js debugging
node --inspect services/api-gateway/index.js

# View detailed logs
DEBUG=* npm start
```

### Code Style
- Use consistent indentation (2 spaces)
- Follow existing patterns in codebase
- Add comments for complex logic

## Testing

### Run All Tests
```bash
./test.sh
```

### Test Individual Endpoints
See TESTING.md for detailed testing guide

## Need Help?
- Check ARCHITECTURE.md for system design
- Check TESTING.md for testing guide
- Check README.md for full documentation
