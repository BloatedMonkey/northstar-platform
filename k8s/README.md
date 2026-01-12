# Kubernetes Deployment Guide

**Author:** Arman Hazrati  
**License:** MIT

This directory contains Kubernetes manifests for deploying the Northstar application to a Kubernetes cluster.

## 📋 Prerequisites

- Kubernetes cluster (v1.24+)
- `kubectl` CLI installed and configured
- Docker images built and pushed to a registry
- NGINX Ingress Controller (for Ingress)
- cert-manager (for TLS certificates)

## 🚀 Quick Start

### 1. Create Namespace

```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets

**IMPORTANT:** Update `secrets.yaml` with your actual base64-encoded secrets:

```bash
# Generate base64 encoded secrets
echo -n 'your-jwt-secret' | base64
echo -n 'your-refresh-secret' | base64
echo -n 'your-db-password' | base64
echo -n 'your-redis-password' | base64
```

Then apply:

```bash
kubectl apply -f secrets.yaml
```

### 3. Apply ConfigMap

```bash
kubectl apply -f configmap.yaml
```

### 4. Deploy Database and Redis

```bash
kubectl apply -f deployment-postgres.yaml
kubectl apply -f deployment-redis.yaml
```

Wait for pods to be ready:

```bash
kubectl wait --for=condition=ready pod -l app=postgres -n northstar --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n northstar --timeout=300s
```

### 5. Deploy Backend

```bash
kubectl apply -f deployment-backend.yaml
```

### 6. Deploy Frontend

```bash
kubectl apply -f deployment-frontend.yaml
```

### 7. Configure Ingress

Update `ingress.yaml` with your domain names, then:

```bash
kubectl apply -f ingress.yaml
```

### 8. Enable Auto-scaling

```bash
kubectl apply -f hpa.yaml
```

## 📊 Monitoring

### Check Deployment Status

```bash
kubectl get all -n northstar
```

### View Logs

```bash
# Backend logs
kubectl logs -f deployment/northstar-backend -n northstar

# Frontend logs
kubectl logs -f deployment/northstar-frontend -n northstar

# Database logs
kubectl logs -f statefulset/postgres -n northstar
```

### Check Pod Health

```bash
kubectl get pods -n northstar
kubectl describe pod <pod-name> -n northstar
```

### Monitor HPA

```bash
kubectl get hpa -n northstar -w
```

## 🔧 Configuration

### Update Environment Variables

Edit `configmap.yaml` and apply:

```bash
kubectl apply -f configmap.yaml
kubectl rollout restart deployment/northstar-backend -n northstar
kubectl rollout restart deployment/northstar-frontend -n northstar
```

### Update Secrets

Edit `secrets.yaml` and apply:

```bash
kubectl apply -f secrets.yaml
kubectl rollout restart deployment/northstar-backend -n northstar
```

### Scale Manually

```bash
# Scale backend
kubectl scale deployment northstar-backend --replicas=5 -n northstar

# Scale frontend
kubectl scale deployment northstar-frontend --replicas=3 -n northstar
```

## 🔄 Rolling Updates

### Update Backend

```bash
# Build and push new image
docker build -t your-registry/northstar-backend:v2 .
docker push your-registry/northstar-backend:v2

# Update deployment
kubectl set image deployment/northstar-backend backend=your-registry/northstar-backend:v2 -n northstar

# Monitor rollout
kubectl rollout status deployment/northstar-backend -n northstar
```

### Rollback

```bash
kubectl rollout undo deployment/northstar-backend -n northstar
```

## 🗄️ Database Management

### Run Migrations

```bash
kubectl exec -it deployment/northstar-backend -n northstar -- npm run prisma:migrate:deploy
```

### Access Database

```bash
kubectl port-forward service/postgres-service 5432:5432 -n northstar
# Then connect with: psql -h localhost -U postgres -d northstar
```

### Backup Database

```bash
kubectl exec -it statefulset/postgres -n northstar -- pg_dump -U postgres northstar > backup.sql
```

## 🔒 Security Best Practices

1. **Secrets Management**: Use external secret managers (AWS Secrets Manager, HashiCorp Vault)
2. **Network Policies**: Implement network policies to restrict pod communication
3. **RBAC**: Configure Role-Based Access Control
4. **Pod Security**: Use Pod Security Standards
5. **Image Scanning**: Scan images for vulnerabilities before deployment

## 📈 Production Recommendations

1. **Managed Databases**: Use managed database services (AWS RDS, Google Cloud SQL)
2. **Managed Redis**: Use managed Redis (AWS ElastiCache, Google Memorystore)
3. **Load Balancing**: Use cloud load balancers
4. **Monitoring**: Integrate with Prometheus and Grafana
5. **Logging**: Use centralized logging (ELK stack, Loki)
6. **Backups**: Implement automated backup strategies
7. **Disaster Recovery**: Plan and test disaster recovery procedures

## 🧹 Cleanup

To remove all resources:

```bash
kubectl delete namespace northstar
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)
- [cert-manager](https://cert-manager.io/)
- [Horizontal Pod Autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

---

**Built with ❤️ by Arman Hazrati**
