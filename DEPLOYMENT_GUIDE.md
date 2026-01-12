# Deployment Guide - Northstar Backend

**Author:** Arman Hazrati  
**Version:** 1.0  
**Last Updated:** 2024

---

## Pre-Deployment Checklist

### ✅ Environment Configuration

- [ ] Create `.env` file from `ENV_TEMPLATE.txt`
- [ ] Update all secret keys with strong, random values
- [ ] Configure database connection string
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins
- [ ] Set up email service credentials (if needed)

### ✅ Database Setup

- [ ] PostgreSQL instance running
- [ ] Redis instance running
- [ ] Run database migrations: `npm run prisma:migrate:deploy`
- [ ] (Optional) Seed initial data: `npm run prisma:seed`

### ✅ Security

- [ ] JWT secrets are strong and unique
- [ ] API keys generated for integrations
- [ ] Rate limiting configured appropriately
- [ ] CORS origins properly restricted
- [ ] Security headers enabled

### ✅ Code Quality

- [ ] All tests passing: `npm run test`
- [ ] E2E tests passing: `npm run test:e2e`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] Build successful: `npm run build`

---

## Deployment Options

### Option 1: Docker Deployment

**Requirements:**
- Docker
- Docker Compose

**Steps:**

1. **Build the application:**
```bash
npm run build
```

2. **Start services with Docker Compose:**
```bash
docker-compose up -d
```

3. **Run migrations:**
```bash
npm run prisma:migrate:deploy
```

4. **Start the application:**
```bash
npm run start:prod
```

**Docker Compose Services:**
- PostgreSQL 16 on port 5432
- Redis 7 on port 6379

---

### Option 2: Heroku Deployment

**Requirements:**
- Heroku CLI
- Heroku account

**Steps:**

1. **Create Heroku app:**
```bash
heroku create your-app-name
```

2. **Add PostgreSQL:**
```bash
heroku addons:create heroku-postgresql:mini
```

3. **Add Redis:**
```bash
heroku addons:create heroku-redis:mini
```

4. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
```

5. **Deploy:**
```bash
git push heroku main
```

6. **Run migrations:**
```bash
heroku run npm run prisma:migrate:deploy
```

---

### Option 3: AWS Deployment

**Architecture:**
- EC2 or ECS for application
- RDS for PostgreSQL
- ElastiCache for Redis
- ALB for load balancing

**Steps:**

1. **Set up RDS PostgreSQL instance**
2. **Set up ElastiCache Redis cluster**
3. **Configure security groups**
4. **Deploy application to EC2/ECS**
5. **Configure environment variables**
6. **Set up ALB with health checks**
7. **Run migrations**

---

### Option 4: DigitalOcean Deployment

**Requirements:**
- DigitalOcean account
- Managed PostgreSQL database
- Managed Redis cluster

**Steps:**

1. **Create Droplet (Ubuntu)**
2. **Set up Managed PostgreSQL**
3. **Set up Managed Redis**
4. **Install Node.js on Droplet**
5. **Clone repository**
6. **Install dependencies: `npm install`**
7. **Build: `npm run build`**
8. **Configure PM2 for process management**
9. **Set up Nginx as reverse proxy**
10. **Configure SSL with Let's Encrypt**

---

## Environment Variables

### Required Variables

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
REDIS_HOST=your-redis-host
REDIS_PORT=6379
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
API_PREFIX=v1
```

### Optional Variables

```bash
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Production Best Practices

### 1. Database

- ✅ Use connection pooling
- ✅ Enable SSL connections
- ✅ Regular backups
- ✅ Monitor query performance
- ✅ Index optimization

### 2. Security

- ✅ Use strong secrets (64+ characters)
- ✅ Enable HTTPS only
- ✅ Restrict CORS origins
- ✅ Regular security audits
- ✅ Keep dependencies updated

### 3. Monitoring

- ✅ Set up application monitoring (New Relic, DataDog)
- ✅ Configure error tracking (Sentry)
- ✅ Set up log aggregation
- ✅ Monitor health check endpoints
- ✅ Configure alerts

### 4. Performance

- ✅ Enable compression
- ✅ Implement caching where appropriate
- ✅ Use CDN for static assets
- ✅ Optimize database queries
- ✅ Scale horizontally with load balancer

---

## Health Checks

### Kubernetes/Container Health Checks

**Liveness Probe:**
```yaml
livenessProbe:
  httpGet:
    path: /v1/healthz
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
```

**Readiness Probe:**
```yaml
readinessProbe:
  httpGet:
    path: /v1/readyz
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5
```

---

## Scaling Considerations

### Horizontal Scaling

The application is designed to scale horizontally:

- ✅ Stateless design
- ✅ Database connection pooling
- ✅ Redis for shared state
- ✅ Load balancer compatible

### Vertical Scaling

Recommended resources:
- **Development:** 1 CPU, 1GB RAM
- **Production:** 2+ CPUs, 4GB+ RAM
- **High Load:** 4+ CPUs, 8GB+ RAM

---

## Backup Strategy

### Database Backups

- **Frequency:** Daily automated backups
- **Retention:** 30 days minimum
- **Testing:** Monthly restore tests

### Configuration Backups

- Store `.env` securely (encrypted)
- Version control (excluding secrets)
- Document all configurations

---

## Monitoring & Alerting

### Key Metrics to Monitor

1. **Application Metrics:**
   - Request rate
   - Response time
   - Error rate
   - Active connections

2. **System Metrics:**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network I/O

3. **Database Metrics:**
   - Connection pool size
   - Query performance
   - Slow queries
   - Lock waits

4. **Queue Metrics:**
   - Job completion rate
   - Failed jobs
   - Queue length
   - Processing time

### Alerting Thresholds

- Error rate > 1%
- Response time > 1s (p95)
- CPU > 80%
- Memory > 85%
- Database connections > 80% of pool

---

## Troubleshooting

### Application Won't Start

1. Check environment variables
2. Verify database connectivity
3. Check Redis connectivity
4. Review logs: `pm2 logs` or container logs
5. Verify port availability

### Database Connection Issues

1. Check DATABASE_URL
2. Verify firewall rules
3. Check database user permissions
4. Review connection pool settings
5. Verify SSL requirements

### Performance Issues

1. Check database query performance
2. Review slow query logs
3. Check Redis connectivity
4. Monitor memory usage
5. Review application logs

---

## Rollback Procedure

1. **Identify issue**
2. **Stop current deployment**
3. **Revert to previous version:**
   ```bash
   git checkout previous-tag
   npm install
   npm run build
   npm run start:prod
   ```
4. **Run necessary migrations (if any)**
5. **Verify application health**
6. **Monitor for issues**

---

## Support & Maintenance

### Regular Maintenance Tasks

- **Weekly:**
  - Review error logs
  - Check performance metrics
  - Monitor disk space

- **Monthly:**
  - Update dependencies
  - Security audit
  - Backup verification
  - Performance review

- **Quarterly:**
  - Major version upgrades
  - Architecture review
  - Capacity planning
  - Disaster recovery drill

---

## Contact

For deployment support:

**Author:** Arman Hazrati  
**Project:** Northstar Backend  
**License:** MIT

---

*This deployment guide is part of the Northstar Backend portfolio project.*
