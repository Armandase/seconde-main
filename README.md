# Seconde Main - Second-Hand Product Search Platform

A comprehensive microservices-based application for searching second-hand products from multiple platforms. Built with React frontend and Node.js backend services.

## Features

- 🔍 **Product Search**: Search for second-hand products with advanced filters
- 📁 **Category Selection**: Filter by electronics, furniture, clothing, sports, books, and more
- 💰 **Price Range**: Set minimum and maximum price filters
- ⭐ **Condition Filter**: Filter by product condition (excellent, good, fair)
- 📍 **Location-Based**: Search products by geographic location
- 👤 **User Accounts**: Create an account and manage your profile
- ❤️ **Favorites**: Save items to your favorites for later viewing
- 🏗️ **Microservices Architecture**: Separated into independent, scalable services
- 🐳 **Docker Support**: Fully containerized with Docker Compose

## Architecture

The application is built using a microservices architecture with the following services:

### Backend Services
- **API Gateway** (Port 4000): Routes requests to appropriate services
- **User Service** (Port 4001): Handles authentication and favorites management
- **Search Service** (Port 4002): Manages product search with Elasticsearch
- **Scraper Service** (Port 4003): Populates database with mock product data

### Frontend
- **React Application** (Port 3000): User interface for searching and managing products

### Databases
- **PostgreSQL**: Stores user accounts and favorites
- **Elasticsearch**: Indexes products for fast search

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- npm or yarn (for local development)

## Quick Start with Docker

### Important Security Note

⚠️ **Before deploying to production**, you MUST set a secure JWT secret:

1. Generate a secure secret:
```bash
openssl rand -base64 32
```

2. Set it in your environment or .env file:
```bash
export JWT_SECRET="your-generated-secret-here"
```

Or create a `.env` file in the root directory:
```bash
JWT_SECRET=your-generated-secret-here
```

The application will fail to start if JWT_SECRET is not properly configured.

### Starting the Application

1. Clone the repository:
```bash
git clone https://github.com/Armandase/seconde-main.git
cd seconde-main
```

2. Set your JWT secret (see security note above)

3. Start all services with Docker Compose:
```bash
docker-compose up --build
```

```bash
docker compose up --build
```

4. Wait for all services to start (this may take a few minutes on first run)

5. Access the application at http://localhost:3000

6. Populate the database with sample products:
```bash
curl -X POST http://localhost:4000/api/scraper/run
```

## Service URLs

- Frontend: http://localhost:3000
- API Gateway: http://localhost:4000
- User Service: http://localhost:4001
- Search Service: http://localhost:4002
- Scraper Service: http://localhost:4003
- PostgreSQL: localhost:5432
- Elasticsearch: http://localhost:9200

## Local Development

### Backend Services

Each service can be run independently for development:

```bash
# API Gateway
cd services/api-gateway
npm install
npm start

# User Service
cd services/user-service
npm install
npm start

# Search Service
cd services/search-service
npm install
npm start

# Scraper Service
cd services/scraper-service
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The React app will be available at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get current user

### Products
- `GET /api/search` - Search products with filters
- `GET /api/products/:id` - Get product by ID

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:productId` - Remove from favorites

### Scraper
- `POST /api/scraper/run` - Trigger scraping and populate database

## Search Filters

The application supports the following search filters:

- **Query**: Free text search in title and description
- **Category**: electronics, furniture, clothing, sports, books, home
- **Condition**: excellent, good, fair
- **Location**: Paris, Lyon, Marseille, Toulouse, Nice, Bordeaux, Grenoble
- **Price Range**: Min and max price in euros
- **Pagination**: Page number and limit

Example search:
```
GET /api/search?query=laptop&category=electronics&minPrice=400&maxPrice=1000&condition=excellent&location=Paris
```

## Environment Variables

### API Gateway
- `PORT`: Service port (default: 4000)
- `USER_SERVICE_URL`: User service URL
- `SEARCH_SERVICE_URL`: Search service URL
- `SCRAPER_SERVICE_URL`: Scraper service URL

### User Service
- `PORT`: Service port (default: 4001)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Search Service
- `PORT`: Service port (default: 4002)
- `ELASTICSEARCH_URL`: Elasticsearch connection URL

### Frontend
- `REACT_APP_API_URL`: API Gateway URL (default: http://localhost:4000)

## Technologies Used

### Frontend
- React 18
- React Router
- Axios
- CSS3

### Backend
- Node.js
- Express
- PostgreSQL with pg
- Elasticsearch
- JWT for authentication
- bcryptjs for password hashing

### DevOps
- Docker
- Docker Compose

## Features in Detail

### Product Search
The search functionality uses Elasticsearch for fast, full-text search with support for:
- Multi-field search (title, description)
- Fuzzy matching
- Price range filtering
- Category and condition filtering
- Location-based filtering
- Pagination

### User Authentication
Secure authentication system with:
- Password hashing using bcryptjs
- JWT token-based authentication
- Protected routes
- Session management

### Favorites System
Users can:
- Add products to favorites
- View all saved favorites
- Remove products from favorites
- Favorites are persisted in PostgreSQL

## Mock Data

The scraper service includes mock data from various second-hand platforms including:
- Leboncoin
- Vinted
- eBay
- Selency

Categories include electronics, furniture, clothing, sports equipment, books, and home & garden items.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
