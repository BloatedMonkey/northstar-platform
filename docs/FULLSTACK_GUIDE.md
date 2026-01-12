# Northstar Full-Stack Development Guide

**Author:** Arman Hazrati  
**License:** MIT

## 📚 Complete Full-Stack Guide

This comprehensive guide covers everything you need to know about the Northstar platform, from development to production deployment.

## 🎯 Project Overview

Northstar is an enterprise-grade, full-stack service orchestration platform built with modern technologies and best practices. It demonstrates senior-level engineering capabilities including:

- **Full-Stack Architecture**: Next.js frontend + NestJS backend
- **Real-time Features**: WebSocket integration for live updates
- **Scalable Infrastructure**: Kubernetes-ready with auto-scaling
- **Production Monitoring**: Prometheus + Grafana observability
- **Advanced Caching**: Redis with intelligent caching strategies
- **Background Processing**: BullMQ for asynchronous tasks
- **Enterprise Security**: JWT, RBAC, API keys, rate limiting
- **Database Excellence**: PostgreSQL with Prisma ORM
- **CI/CD Pipeline**: Automated testing, linting, and deployment
- **Container-Ready**: Docker and Docker Compose support

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client
- **Testing**: Jest, Testing Library, Playwright

### Backend
- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache**: Redis
- **Job Queue**: BullMQ
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Logging**: Pino
- **API Docs**: Swagger/OpenAPI
- **Testing**: Jest, Supertest

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions
- **Security**: Dependabot, Husky hooks

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 16
- Redis 7

# Optional (for Kubernetes)
- kubectl
- Kubernetes cluster (minikube, kind, or cloud provider)
```

### Local Development Setup

#### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/yourusername/northstar.git
cd northstar

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

#### 2. Environment Configuration

```bash
# Backend (.env)
cp ENV_TEMPLATE.txt .env

# Frontend (client/.env.local)
cd client
cp .env.local.example .env.local
cd ..
```

#### 3. Start Infrastructure

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait for services to be ready
sleep 10
```

#### 4. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

#### 5. Start Development Servers

```bash
# Terminal 1: Backend
npm run start:dev

# Terminal 2: Frontend
cd client
npm run dev
```

Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api
- **Prisma Studio**: `npm run prisma:studio`

## 📁 Project Structure

```
northstar/
├── client/                    # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   ├── lib/              # Utilities and API client
│   │   ├── store/            # Zustand state management
│   │   ├── hooks/            # Custom React hooks
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend Docker image
│   └── package.json
│
├── src/                      # NestJS backend
│   ├── auth/                 # Authentication module
│   ├── users/                # User management
│   ├── service-requests/     # Service request handling
│   ├── provider-responses/   # Provider responses
│   ├── admin/                # Admin functionality
│   ├── jobs/                 # Background job processing
│   ├── websocket/            # WebSocket gateway
│   ├── observability/        # Metrics and health checks
│   ├── common/               # Shared utilities
│   │   ├── guards/           # Auth guards
│   │   ├── decorators/       # Custom decorators
│   │   ├── filters/          # Exception filters
│   │   ├── middleware/       # Middleware
│   │   └── cache/            # Caching service
│   ├── prisma/               # Prisma service
│   └── main.ts               # Application entry point
│
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Prisma schema
│   ├── migrations/           # Database migrations
│   └── seed.ts               # Database seeding
│
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── deployment-postgres.yaml
│   ├── deployment-redis.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── monitoring/
│       ├── prometheus-config.yaml
│       └── grafana.yaml
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_DIAGRAM.md
│   └── FULLSTACK_GUIDE.md
│
├── test/                     # E2E tests
├── scripts/                  # Utility scripts
├── .github/                  # GitHub Actions CI/CD
├── docker-compose.yml        # Development environment
├── docker-compose.prod.yml   # Production environment
├── Dockerfile                # Backend Docker image
└── README.md
```

## 🔐 Authentication & Authorization

### JWT Authentication

```typescript
// Login flow
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "CUSTOMER"
  }
}
```

### Role-Based Access Control (RBAC)

- **ADMIN**: Full system access
- **BUSINESS**: Business operations and staff management
- **STAFF**: Service provider operations
- **CUSTOMER**: Customer operations

### API Key Authentication

For server-to-server communication:

```bash
# Generate API key
npm run generate:api-key

# Use in requests
curl -H "X-API-Key: your-api-key" http://localhost:3000/api/endpoint
```

## 🔄 Real-time Features

### WebSocket Connection

```typescript
// Frontend connection
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: accessToken
  }
});

// Listen for notifications
socket.on('notification', (data) => {
  console.log('Received notification:', data);
});

// Subscribe to channels
socket.emit('subscribe', { channel: 'service-requests' });
```

### Notification Types

- Service request created/updated/completed
- Provider responses
- System notifications
- Real-time metrics updates

## 📊 Monitoring & Observability

### Health Checks

```bash
# Application health
GET /health

# Detailed metrics
GET /observability/metrics

# Prometheus metrics
GET /metrics
```

### Prometheus Metrics

- Request count and latency
- Database connection pool
- Cache hit/miss ratio
- Job queue statistics
- Memory and CPU usage

### Grafana Dashboards

Access Grafana at `http://localhost:3000` (when deployed with monitoring stack)

Pre-configured dashboards:
- Application Overview
- API Performance
- Database Metrics
- Cache Performance
- Job Queue Status

## 🧪 Testing

### Backend Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
cd client

# Unit tests
npm run test

# E2E tests with Playwright
npm run e2e

# E2E with UI
npm run e2e:ui
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build images
docker build -t northstar-backend .
cd client && docker build -t northstar-frontend .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get all -n northstar

# View logs
kubectl logs -f deployment/northstar-backend -n northstar
```

### Cloud Deployment

#### AWS EKS
- Use EKS for Kubernetes cluster
- RDS for PostgreSQL
- ElastiCache for Redis
- ALB for load balancing

#### Google Cloud (GKE)
- Use GKE for Kubernetes cluster
- Cloud SQL for PostgreSQL
- Memorystore for Redis
- Cloud Load Balancing

#### Azure (AKS)
- Use AKS for Kubernetes cluster
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Azure Load Balancer

## 🔧 Performance Optimization

### Caching Strategy

```typescript
// Use caching service
const data = await cacheService.getOrSet(
  'cache-key',
  async () => {
    // Expensive operation
    return await fetchData();
  },
  { ttl: 3600 } // 1 hour
);
```

### Database Optimization

- Connection pooling with Prisma
- Indexed columns for frequent queries
- Efficient query patterns
- Database query caching

### API Optimization

- Response compression (gzip)
- Rate limiting to prevent abuse
- Pagination for large datasets
- Field selection to reduce payload size

## 🔒 Security Best Practices

### Implemented Security Features

1. **Authentication**
   - JWT with short-lived access tokens
   - Refresh token rotation
   - Password hashing with bcrypt

2. **Authorization**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - API key validation

3. **Input Validation**
   - DTO validation with class-validator
   - SQL injection prevention (Prisma)
   - XSS protection

4. **Network Security**
   - HTTPS/TLS encryption
   - CORS configuration
   - Rate limiting
   - Helmet security headers

5. **Monitoring**
   - Audit logging
   - Security event tracking
   - Anomaly detection ready

## 📈 Scalability Features

- **Horizontal scaling**: Multiple pod replicas
- **Auto-scaling**: HPA based on CPU/memory
- **Load balancing**: Kubernetes service load balancing
- **Caching**: Redis for frequently accessed data
- **Async processing**: Background jobs with BullMQ
- **Database connection pooling**: Efficient resource usage

## 🎓 Best Practices Demonstrated

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code consistency
- Comprehensive error handling
- Structured logging with Pino

### Architecture
- Clean architecture principles
- Separation of concerns
- Dependency injection
- Modular design

### DevOps
- CI/CD with GitHub Actions
- Automated testing
- Container-based deployment
- Infrastructure as Code (Kubernetes manifests)

### Documentation
- API documentation with Swagger
- Comprehensive README files
- Architecture diagrams
- Deployment guides

## 🤝 Contributing

This is a portfolio project by **Arman Hazrati**. For inquiries or collaboration opportunities, please reach out.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ by Arman Hazrati**

This project showcases senior-level full-stack engineering capabilities including modern frameworks, scalable architecture, production-ready infrastructure, and enterprise-grade security.
