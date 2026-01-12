# Production Deployment Guide

**Author:** Arman Hazrati  
**License:** MIT

## 🚀 Complete Production Deployment Guide

This guide provides step-by-step instructions for deploying the Northstar platform to production environments.

## 📋 Pre-Deployment Checklist

### Security

- [ ] All secrets are stored securely (not in code)
- [ ] JWT secrets are strong and unique
- [ ] Database passwords are complex
- [ ] API keys are generated and secured
- [ ] CORS origins are properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS/TLS certificates are configured
- [ ] Security headers are enabled (Helmet)
- [ ] Input validation is comprehensive
- [ ] Audit logging is enabled

### Performance

- [ ] Database indexes are optimized
- [ ] Caching strategy is implemented
- [ ] Connection pooling is configured
- [ ] Static assets are optimized
- [ ] Compression is enabled
- [ ] CDN is configured (if applicable)

### Monitoring

- [ ] Health check endpoints are working
- [ ] Prometheus metrics are exposed
- [ ] Grafana dashboards are configured
- [ ] Log aggregation is set up
- [ ] Alerting rules are defined
- [ ] Error tracking is enabled

### Backup & Recovery

- [ ] Database backup strategy is defined
- [ ] Backup automation is configured
- [ ] Disaster recovery plan is documented
- [ ] Recovery procedures are tested

## 🐳 Docker Production Deployment

### 1. Build Production Images

```bash
# Backend
docker build -t northstar-backend:v1.0.0 -f Dockerfile .

# Frontend
cd client
docker build -t northstar-frontend:v1.0.0 -f Dockerfile .
```

### 2. Push to Container Registry

```bash
# Tag for registry
docker tag northstar-backend:v1.0.0 your-registry.com/northstar-backend:v1.0.0
docker tag northstar-frontend:v1.0.0 your-registry.com/northstar-frontend:v1.0.0

# Push
docker push your-registry.com/northstar-backend:v1.0.0
docker push your-registry.com/northstar-frontend:v1.0.0
```

### 3. Deploy with Docker Compose

```bash
# Update docker-compose.prod.yml with your registry images
# Set environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export JWT_SECRET="your-production-secret"
export REDIS_HOST="your-redis-host"

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## ☸️ Kubernetes Production Deployment

### Prerequisites

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify cluster access
kubectl cluster-info
kubectl get nodes
```

### 1. Create Production Secrets

```bash
# Generate strong secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)

# Create Kubernetes secrets
kubectl create secret generic northstar-secrets \
  --from-literal=JWT_SECRET=$JWT_SECRET \
  --from-literal=JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET \
  --from-literal=DATABASE_PASSWORD=$DB_PASSWORD \
  --from-literal=REDIS_PASSWORD=$REDIS_PASSWORD \
  -n northstar

# Verify
kubectl get secrets -n northstar
```

### 2. Update ConfigMap

```bash
# Edit k8s/configmap.yaml with production values
# - Update CORS_ORIGIN with your domain
# - Set NODE_ENV to "production"
# - Configure database connection strings

kubectl apply -f k8s/configmap.yaml
```

### 3. Deploy Infrastructure

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy PostgreSQL (or use managed service)
kubectl apply -f k8s/deployment-postgres.yaml

# Deploy Redis
kubectl apply -f k8s/deployment-redis.yaml

# Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=postgres -n northstar --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n northstar --timeout=300s
```

### 4. Run Database Migrations

```bash
# Create a one-time job for migrations
kubectl run migration-job \
  --image=your-registry.com/northstar-backend:v1.0.0 \
  --restart=Never \
  --namespace=northstar \
  --command -- npm run prisma:migrate:deploy

# Check migration status
kubectl logs migration-job -n northstar

# Clean up
kubectl delete pod migration-job -n northstar
```

### 5. Deploy Application

```bash
# Deploy backend
kubectl apply -f k8s/deployment-backend.yaml

# Deploy frontend
kubectl apply -f k8s/deployment-frontend.yaml

# Verify deployments
kubectl get deployments -n northstar
kubectl get pods -n northstar

# Check pod logs
kubectl logs -f deployment/northstar-backend -n northstar
```

### 6. Configure Ingress

```bash
# Install NGINX Ingress Controller (if not already installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Update k8s/ingress.yaml with your domain
# Apply ingress
kubectl apply -f k8s/ingress.yaml

# Get ingress IP
kubectl get ingress -n northstar
```

### 7. Configure TLS/SSL

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer for Let's Encrypt
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# Certificates will be automatically provisioned
```

### 8. Enable Auto-scaling

```bash
# Deploy HPA
kubectl apply -f k8s/hpa.yaml

# Monitor HPA
kubectl get hpa -n northstar -w
```

### 9. Deploy Monitoring Stack

```bash
# Deploy Prometheus
kubectl apply -f k8s/monitoring/prometheus-config.yaml

# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana
kubectl port-forward service/grafana-service 3000:3000 -n northstar
# Open http://localhost:3000 (admin/admin)
```

## ☁️ Cloud Provider Specific Deployments

### AWS (EKS)

```bash
# Create EKS cluster
eksctl create cluster \
  --name northstar-prod \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 5 \
  --managed

# Configure kubectl
aws eks update-kubeconfig --region us-east-1 --name northstar-prod

# Use RDS for PostgreSQL
# Use ElastiCache for Redis
# Use ALB Ingress Controller

# Deploy application
kubectl apply -f k8s/
```

### Google Cloud (GKE)

```bash
# Create GKE cluster
gcloud container clusters create northstar-prod \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type n1-standard-2 \
  --enable-autoscaling \
  --min-nodes 2 \
  --max-nodes 5

# Configure kubectl
gcloud container clusters get-credentials northstar-prod --zone us-central1-a

# Use Cloud SQL for PostgreSQL
# Use Memorystore for Redis

# Deploy application
kubectl apply -f k8s/
```

### Azure (AKS)

```bash
# Create resource group
az group create --name northstar-rg --location eastus

# Create AKS cluster
az aks create \
  --resource-group northstar-rg \
  --name northstar-prod \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Configure kubectl
az aks get-credentials --resource-group northstar-rg --name northstar-prod

# Use Azure Database for PostgreSQL
# Use Azure Cache for Redis

# Deploy application
kubectl apply -f k8s/
```

## 📊 Post-Deployment Verification

### 1. Health Checks

```bash
# Check application health
curl https://your-domain.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-12T...",
  "uptime": 123.45
}
```

### 2. API Verification

```bash
# Test API endpoints
curl https://api.your-domain.com/api

# Test authentication
curl -X POST https://api.your-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. WebSocket Verification

```bash
# Test WebSocket connection
npm install -g wscat
wscat -c wss://api.your-domain.com
```

### 4. Monitoring Verification

```bash
# Check Prometheus metrics
curl https://api.your-domain.com/metrics

# Access Grafana dashboards
# Navigate to https://grafana.your-domain.com
```

## 🔄 Rolling Updates

### Update Application

```bash
# Build new version
docker build -t your-registry.com/northstar-backend:v1.1.0 .
docker push your-registry.com/northstar-backend:v1.1.0

# Update deployment
kubectl set image deployment/northstar-backend \
  backend=your-registry.com/northstar-backend:v1.1.0 \
  -n northstar

# Monitor rollout
kubectl rollout status deployment/northstar-backend -n northstar

# Rollback if needed
kubectl rollout undo deployment/northstar-backend -n northstar
```

## 🗄️ Database Management

### Backup

```bash
# Manual backup
kubectl exec -it statefulset/postgres -n northstar -- \
  pg_dump -U postgres northstar > backup-$(date +%Y%m%d).sql

# Automated backup (CronJob)
cat <<EOF | kubectl apply -f -
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: northstar
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres-service -U postgres northstar | gzip > /backup/backup-\$(date +%Y%m%d).sql.gz
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
EOF
```

### Restore

```bash
# Restore from backup
kubectl exec -i statefulset/postgres -n northstar -- \
  psql -U postgres northstar < backup-20240112.sql
```

## 🚨 Monitoring & Alerting

### Configure Alerts

```yaml
# prometheus-alerts.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-alerts
  namespace: northstar
data:
  alerts.yml: |
    groups:
    - name: northstar
      rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
      
      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
```

## 🧹 Maintenance

### Scale Resources

```bash
# Manual scaling
kubectl scale deployment northstar-backend --replicas=5 -n northstar

# Update HPA limits
kubectl patch hpa northstar-backend-hpa -n northstar \
  -p '{"spec":{"maxReplicas":15}}'
```

### Update Secrets

```bash
# Update secrets
kubectl create secret generic northstar-secrets \
  --from-literal=JWT_SECRET=new-secret \
  --dry-run=client -o yaml | kubectl apply -f -

# Restart pods to pick up new secrets
kubectl rollout restart deployment/northstar-backend -n northstar
```

### Clean Up Old Resources

```bash
# Remove old ReplicaSets
kubectl delete replicaset --all -n northstar

# Clean up completed jobs
kubectl delete jobs --field-selector status.successful=1 -n northstar
```

## 🔒 Security Hardening

### Network Policies

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: northstar-network-policy
  namespace: northstar
spec:
  podSelector:
    matchLabels:
      app: northstar-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: northstar-frontend
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

### Pod Security

```yaml
# pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  runAsUser:
    rule: MustRunAsNonRoot
  seLinux:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'secret'
```

## 📈 Performance Tuning

### Database Connection Pooling

```typescript
// Prisma connection pool configuration
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 20
  pool_timeout = 10
}
```

### Redis Configuration

```bash
# Optimize Redis for production
kubectl exec -it deployment/redis -n northstar -- redis-cli CONFIG SET maxmemory 256mb
kubectl exec -it deployment/redis -n northstar -- redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## 🎯 Success Criteria

- [ ] All services are running and healthy
- [ ] Health checks are passing
- [ ] API endpoints are accessible
- [ ] WebSocket connections work
- [ ] Database is accessible and performant
- [ ] Caching is working correctly
- [ ] Monitoring dashboards show data
- [ ] Logs are being collected
- [ ] Auto-scaling is functioning
- [ ] Backups are running
- [ ] SSL certificates are valid
- [ ] Performance meets requirements

## 📞 Support & Troubleshooting

### Common Issues

1. **Pods not starting**: Check logs with `kubectl logs`
2. **Database connection errors**: Verify secrets and connection strings
3. **High memory usage**: Adjust resource limits and check for memory leaks
4. **Slow API responses**: Check database queries and caching
5. **WebSocket disconnections**: Verify load balancer configuration

### Getting Help

For issues or questions about this deployment:
- Review logs: `kubectl logs -f deployment/northstar-backend -n northstar`
- Check events: `kubectl get events -n northstar`
- Describe resources: `kubectl describe pod <pod-name> -n northstar`

---

**Built with ❤️ by Arman Hazrati**

This production deployment guide ensures a secure, scalable, and maintainable deployment of the Northstar platform.
