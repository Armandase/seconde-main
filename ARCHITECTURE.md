# Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │          React Application (Port 3000)                    │ │
│  │                                                           │ │
│  │  - Search Interface                                       │ │
│  │  - Authentication Pages                                   │ │
│  │  - Favorites Management                                   │ │
│  │  - Product Display                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │          API Gateway (Port 4000)                          │ │
│  │                                                           │ │
│  │  - Request Routing                                        │ │
│  │  - Service Proxy                                          │ │
│  │  - CORS Handling                                          │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Microservices Layer                         │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ User Service   │  │ Search Service │  │ Scraper Service │  │
│  │  (Port 4001)   │  │  (Port 4002)   │  │  (Port 4003)    │  │
│  │                │  │                │  │                 │  │
│  │ - Auth         │  │ - Product      │  │ - Data          │  │
│  │ - Registration │  │   Search       │  │   Collection    │  │
│  │ - Login/JWT    │  │ - Filtering    │  │ - Mock Data     │  │
│  │ - Favorites    │  │ - Pagination   │  │ - Indexing      │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
│         │                     │                                │
└─────────┼─────────────────────┼────────────────────────────────┘
          │                     │
          ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│                                                                 │
│  ┌──────────────────────┐       ┌─────────────────────────┐   │
│  │   PostgreSQL DB      │       │   Elasticsearch         │   │
│  │   (Port 5432)        │       │   (Port 9200)           │   │
│  │                      │       │                         │   │
│  │ - Users Table        │       │ - Products Index        │   │
│  │ - Favorites Table    │       │ - Full-Text Search      │   │
│  │ - Relational Data    │       │ - Aggregations          │   │
│  └──────────────────────┘       └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React Application)
- **Technology**: React 18, React Router, Axios
- **Port**: 3000
- **Responsibilities**:
  - User interface for product search
  - Authentication forms (login/register)
  - Favorites management UI
  - Client-side routing
  - State management

### API Gateway
- **Technology**: Node.js, Express, Axios
- **Port**: 4000
- **Responsibilities**:
  - Single entry point for all client requests
  - Routes requests to appropriate microservices
  - CORS configuration
  - Request/response transformation

### User Service
- **Technology**: Node.js, Express, PostgreSQL, JWT, bcryptjs
- **Port**: 4001
- **Responsibilities**:
  - User registration and authentication
  - Password hashing and verification
  - JWT token generation and validation
  - Favorites CRUD operations
  - User profile management

### Search Service
- **Technology**: Node.js, Express, Elasticsearch
- **Port**: 4002
- **Responsibilities**:
  - Product indexing in Elasticsearch
  - Full-text search with fuzzy matching
  - Multi-field filtering (category, price, condition, location)
  - Pagination
  - Aggregations

### Scraper Service
- **Technology**: Node.js, Express, Axios
- **Port**: 4003
- **Responsibilities**:
  - Mock data generation for second-hand products
  - Simulates scraping from multiple platforms
  - Bulk product indexing
  - Data transformation

### PostgreSQL Database
- **Port**: 5432
- **Schema**:
  - `users` table: User accounts (id, email, password, name, created_at)
  - `favorites` table: User favorites (id, user_id, product_id, product_data, created_at)

### Elasticsearch
- **Port**: 9200
- **Index**: `products`
- **Fields**: id, title, description, price, category, condition, location, imageUrl, source, url, createdAt

## Communication Patterns

### Request Flow

1. **User Search Flow**:
   ```
   Browser → Frontend → API Gateway → Search Service → Elasticsearch
   ```

2. **User Authentication Flow**:
   ```
   Browser → Frontend → API Gateway → User Service → PostgreSQL
   ```

3. **Favorites Flow**:
   ```
   Browser → Frontend → API Gateway → User Service → PostgreSQL
   ```

4. **Data Population Flow**:
   ```
   Scraper Service → Search Service → Elasticsearch
   ```

## Security

### Authentication
- JWT-based authentication
- Passwords hashed with bcryptjs (salt rounds: 10)
- Protected routes require valid JWT token
- Token expiration: 7 days

### CORS
- Configured in API Gateway
- Allows requests from frontend origin

### Environment Variables
- Sensitive data (JWT secret, database passwords) in environment variables
- Not committed to version control
- Template provided in `.env.example`

## Scalability Considerations

### Horizontal Scaling
- All services are stateless and can be scaled horizontally
- Database connections pooled
- Elasticsearch supports clustering

### Caching
- Future: Add Redis for session caching
- Future: Add CDN for static assets

### Load Balancing
- API Gateway can be load balanced
- Each microservice can run multiple instances

## Data Flow

### Product Search
1. User enters search criteria in frontend
2. Frontend sends GET request to API Gateway
3. API Gateway forwards to Search Service
4. Search Service queries Elasticsearch
5. Results returned through the chain
6. Frontend displays products

### Add to Favorites
1. User clicks favorite button
2. Frontend sends POST request with JWT token
3. API Gateway forwards to User Service
4. User Service validates JWT
5. User Service stores favorite in PostgreSQL
6. Confirmation returned to frontend

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React, React Router | UI Framework, Routing |
| API Gateway | Node.js, Express | Request Routing |
| Services | Node.js, Express | Backend Logic |
| Authentication | JWT, bcryptjs | Security |
| Database | PostgreSQL | Relational Data |
| Search | Elasticsearch | Full-Text Search |
| Containerization | Docker, Docker Compose | Deployment |

## Development Workflow

1. **Local Development**:
   - Each service can run independently
   - Connect to local databases
   - Hot reload with nodemon

2. **Docker Development**:
   - `docker compose up` starts all services
   - Services communicate via Docker network
   - Volumes for data persistence

3. **Testing**:
   - Unit tests for individual services
   - Integration tests via API Gateway
   - End-to-end tests with frontend

## Future Enhancements

1. **Performance**:
   - Add Redis for caching
   - Implement rate limiting
   - Add API response compression

2. **Features**:
   - Real web scraping integration
   - Product recommendations
   - Price alerts
   - User reviews and ratings

3. **Operations**:
   - Health check endpoints
   - Metrics and monitoring
   - Centralized logging
   - CI/CD pipeline

4. **Security**:
   - OAuth2 integration
   - Two-factor authentication
   - API key management
   - HTTPS enforcement
