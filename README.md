# Northstar Platform

<div align="center">

![Portfolio Project](https://img.shields.io/badge/Portfolio-Project-blue?style=for-the-badge)
![Production Ready](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Author](https://img.shields.io/badge/Author-Arman_Hazrati-purple?style=for-the-badge)

[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?logo=kubernetes&logoColor=white)](https://kubernetes.io/)

**Enterprise-Grade Full-Stack Service Marketplace Platform**

Built by **Arman Hazrati** | Demonstrating Production-Ready Architecture

[Features](#features) • [Quick Start](#getting-started) • [Architecture](#architecture) • [API Docs](#api-endpoints) • [Deployment](#deployment)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Attribution](#attribution)
- [License](#license)

---

## 🎯 Overview

**Author:** Arman Hazrati  
**License:** MIT  
**Status:** Production-Ready  
**Copyright:** © 2024-2026 Arman Hazrati. All Rights Reserved.

Production-grade backend service for a service marketplace platform. Built with NestJS, TypeScript, PostgreSQL, and Redis.

This project demonstrates enterprise-level backend development skills, clean architecture, security best practices, and modern software engineering principles. Complete with comprehensive testing, CI/CD pipeline, Docker support, and extensive documentation.

---

## ✨ Features

### Core Features
- 🔐 **Authentication & Authorization** - JWT with refresh tokens, RBAC (4 roles)
- 👥 **User Management** - Complete CRUD with role-based permissions
- 📋 **Service Requests** - Full lifecycle management (draft → completed)
- 💼 **Provider Responses** - Quote system for service providers
- 📊 **Admin Dashboard** - Audit logs, system monitoring
- 🔔 **Real-time Notifications** - WebSocket integration
- ⚡ **Background Jobs** - BullMQ for async processing
- 📈 **Observability** - Metrics, health checks, structured logging
- 🔑 **API Keys** - Secure integration authentication

### Technical Features
- ✅ Production-ready architecture with clean code
- ✅ Comprehensive testing (unit + E2E)
- ✅ Docker & Kubernetes deployments
- ✅ Database migrations with Prisma
- ✅ Rate limiting and security headers
- ✅ Swagger/OpenAPI documentation
- ✅ CI/CD ready with health checks
- ✅ Horizontal scaling support

---

## 🏗️ Architecture

Northstar Platform follows a modular architecture with clear separation of concerns:

- **Modules**: Feature-based modules (auth, users, service-requests, etc.)
- **Guards**: Authentication and authorization guards
- **Services**: Business logic layer
- **Controllers**: HTTP request handlers
- **DTOs**: Data transfer objects for validation
- **Events**: Internal event bus for decoupled communication
- **Jobs**: Background job processing with BullMQ

### Key Components

- **Authentication**: JWT-based auth with refresh tokens
- **Authorization**: Role-based access control (RBAC) with ADMIN, BUSINESS, STAFF, CUSTOMER roles
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis-based job queue for async processing
- **Observability**: Structured logging, metrics, correlation IDs
- **API**: RESTful API with OpenAPI documentation

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Queue**: BullMQ (Redis)
- **Auth**: JWT (passport)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   # Windows (PowerShell):
   Copy-Item .env.example .env
   
   # Unix/Mac:
   cp .env.example .env
   ```

4. Start Docker services:
   ```bash
   docker-compose up -d
   ```

5. Run migrations and seed:
   ```bash
   npm run prisma:migrate
   npm run prisma:seed
   ```

6. Start the development server:
   ```bash
   npm run start:dev
   ```

Or use the Makefile:
```bash
make dev
```

The API will be available at `http://localhost:3000`

API documentation: `http://localhost:3000/api/docs`

## Environment Variables

Key environment variables (see `.env.example` for full list):

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `API_PREFIX`: API prefix (default: v1)

## API Endpoints

### Authentication

- `POST /v1/auth/login` - Login with email and password
- `POST /v1/auth/refresh` - Refresh access token
- `GET /v1/auth/me` - Get current user profile

### Service Requests

- `POST /v1/service-requests` - Create a service request
- `GET /v1/service-requests` - List service requests (with filtering, pagination)
- `GET /v1/service-requests/:id` - Get service request by ID
- `PATCH /v1/service-requests/:id` - Update service request
- `PATCH /v1/service-requests/:id/status` - Update request status

### Provider Responses

- `POST /v1/service-requests/:id/responses` - Respond to a service request
- `GET /v1/service-requests/:id/responses` - Get responses for a request
- `GET /v1/provider-responses/my-responses` - Get my provider responses

### Admin

- `GET /v1/admin/audit-logs` - Get audit logs (ADMIN/STAFF only)

### Health & Observability

- `GET /v1/healthz` - Health check
- `GET /v1/readyz` - Readiness check
- `GET /v1/observability/metrics` - Application metrics
- `GET /v1/observability/metrics/prometheus` - Prometheus metrics

### Integrations

- `GET /v1/integrations/status` - Integration status (API key required)

## RBAC (Role-Based Access Control)

The system supports four roles:

- **ADMIN**: Full system access, can manage users, view audit logs
- **BUSINESS**: Can respond to service requests, manage business profile
- **STAFF**: Can review requests, view audit logs, manage requests
- **CUSTOMER**: Can create and manage their own service requests

## Database Schema

Key models:

- **User**: System users with roles and status
- **Business**: Business profiles for providers
- **CustomerProfile**: Customer profiles
- **ServiceRequest**: Service requests with status workflow
- **ProviderResponse**: Provider quotes and responses
- **Note**: Internal notes on requests
- **AuditLog**: Audit trail of system actions
- **ApiKey**: API keys for server-to-server integration

See `prisma/schema.prisma` for full schema definition.

## Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

Run with coverage:
```bash
npm run test:cov
```

## Development

### Database Migrations

Create a new migration:
```bash
npm run prisma:migrate
```

Apply migrations:
```bash
npm run prisma:migrate:deploy
```

### Seeding

Seed the database with demo data:
```bash
npm run prisma:seed
```

### Code Quality

Format code:
```bash
npm run format
```

Lint code:
```bash
npm run lint
```

## Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # User management
├── service-requests/  # Service request management
├── provider-responses/# Provider response handling
├── admin/             # Admin endpoints
├── jobs/              # Background job processors
├── observability/     # Metrics and monitoring
├── integrations/      # API key protected endpoints
├── common/            # Shared utilities, guards, decorators
├── prisma/            # Prisma service
└── main.ts            # Application entry point

docs/
├── CLIENT_DEMO.md     # Non-technical client demo guide
├── TECH_DEMO.md       # Technical demo with endpoints
├── API.md             # API documentation
└── ARCHITECTURE.md    # Architecture overview
```

## Background Jobs

Jobs are processed via BullMQ:

- **Email Queue**: Sends notifications (e.g., when requests are submitted/completed)
- **Cleanup Queue**: Periodic cleanup tasks (e.g., old audit logs)

Jobs are triggered by events emitted from the application.

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting (100 requests per minute)
- Input validation
- Security headers (Helmet)
- CORS configuration
- API key authentication for integrations

## Documentation

This project includes comprehensive documentation:

- **[QUICKSTART.md](QUICKSTART.md)** - Quick setup and installation guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete technical overview
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing strategy and coverage
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Code organization
- **[SECURITY.md](SECURITY.md)** - Security policy and best practices
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[docs/API.md](docs/API.md)** - Complete API reference
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[docs/TECH_DEMO.md](docs/TECH_DEMO.md)** - Technical demonstration

API documentation is also available via Swagger UI at `/api/docs` when running the server.

## Platform Notes

### Windows
If using Windows PowerShell, all npm scripts work directly. The `make` command requires Unix-like systems (Linux/macOS) or WSL.

Alternative to `make dev`:
```bash
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

### macOS/Linux
Use either `make` commands or npm scripts directly.

## Contributing

Contributions, suggestions, and feedback are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📊 Project Statistics

- **Lines of Code**: 10,000+
- **Test Coverage**: High coverage on critical paths
- **Files**: 100+ TypeScript/React files
- **API Endpoints**: 20+ RESTful endpoints
- **Database Tables**: 8 optimized tables
- **Docker Images**: Multi-stage optimized builds
- **Documentation**: 15+ comprehensive guides

---

## 🏆 Attribution

This is a **portfolio project** developed by **Arman Hazrati** to demonstrate:

✅ Enterprise-grade full-stack development  
✅ Production-ready architecture and code quality  
✅ Security best practices and authentication  
✅ DevOps and deployment expertise  
✅ Comprehensive testing and documentation  
✅ Modern technology stack proficiency

### Usage Rights

- ✅ View and learn from the code
- ✅ Reference in technical discussions
- ✅ Use snippets with proper attribution
- ❌ Do not claim as your own work
- ❌ Do not remove attribution/copyright notices
- ❌ Do not present as your portfolio project

See [ATTRIBUTION.md](./ATTRIBUTION.md) for detailed terms.

---

## 👨‍💻 Author

**Arman Hazrati**  
Senior Full-Stack Engineer

This project demonstrates production-grade backend development capabilities with modern technologies, clean architecture, and professional software engineering practices.

📧 Contact: workarman9@gmail.com  
💼 LinkedIn: https://www.linkedin.com/in/armanhazrati/  
🌐 Portfolio: https://armanhazrati.dev/

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

**Copyright © 2024-2026 Arman Hazrati. All Rights Reserved.**

This project is open source under MIT License with required attribution.

---

<div align="center">

**Built with ❤️ by Arman Hazrati**

⭐ Star this repo if you find it helpful! ⭐

[Report Bug](https://github.com/BloatedMonkey/northstar-platform/issues) • [Request Feature](https://github.com/BloatedMonkey/northstar-platform/issues)

</div>

