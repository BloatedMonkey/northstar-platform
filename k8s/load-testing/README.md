# Load Testing Guide

**Author:** Arman Hazrati

## 🎯 Overview

This directory contains load testing scripts and configurations for the Northstar platform.

## 🛠️ Tools

### K6 (Recommended)

K6 is a modern load testing tool built for developers.

#### Installation

```bash
# macOS
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
choco install k6
```

#### Running Tests

```bash
# Basic test
k6 run k6-script.js

# Test with custom target
k6 run --env BASE_URL=https://api.your-domain.com k6-script.js

# Test with custom VUs and duration
k6 run --vus 100 --duration 5m k6-script.js

# Output results to file
k6 run --out json=results.json k6-script.js
```

## 📊 Test Scenarios

### 1. Smoke Test
Quick test with minimal load to verify system works.

```bash
k6 run --vus 1 --duration 1m k6-script.js
```

### 2. Load Test
Normal load to test system under expected traffic.

```bash
k6 run --vus 50 --duration 10m k6-script.js
```

### 3. Stress Test
High load to find system breaking point.

```bash
k6 run --vus 200 --duration 15m k6-script.js
```

### 4. Spike Test
Sudden traffic spike to test auto-scaling.

```bash
k6 run --stage 0s:0,10s:100,1m:100,10s:0 k6-script.js
```

### 5. Soak Test
Extended duration to find memory leaks.

```bash
k6 run --vus 50 --duration 4h k6-script.js
```

## 📈 Performance Targets

### Response Times
- **p50 (median)**: < 200ms
- **p95**: < 500ms
- **p99**: < 1000ms

### Throughput
- **Minimum**: 100 requests/second
- **Target**: 500 requests/second
- **Maximum**: 1000+ requests/second

### Error Rates
- **Target**: < 0.1%
- **Maximum**: < 1%

### Resource Usage
- **CPU**: < 70% average
- **Memory**: < 80% average
- **Database connections**: < 80% of pool

## 🔍 Monitoring During Tests

### Watch Metrics

```bash
# Watch pod metrics
kubectl top pods -n northstar -w

# Watch HPA
kubectl get hpa -n northstar -w

# Watch pod count
watch -n 1 'kubectl get pods -n northstar | grep northstar-backend'
```

### Access Grafana

```bash
# Port forward Grafana
kubectl port-forward service/grafana-service 3000:3000 -n northstar

# Open http://localhost:3000
```

### Check Prometheus

```bash
# Port forward Prometheus
kubectl port-forward service/prometheus-service 9090:9090 -n northstar

# Open http://localhost:9090
```

## 📊 Analyzing Results

### K6 Output

K6 provides detailed metrics:

```
checks.........................: 99.50% ✓ 9950      ✗ 50
data_received..................: 15 MB  250 kB/s
data_sent......................: 1.2 MB 20 kB/s
http_req_blocked...............: avg=1.2ms    min=1µs    med=5µs     max=150ms   p(90)=10µs    p(95)=15µs
http_req_connecting............: avg=500µs    min=0s     med=0s      max=50ms    p(90)=0s      p(95)=0s
http_req_duration..............: avg=150ms    min=50ms   med=120ms   max=2s      p(90)=250ms   p(95)=350ms
http_req_failed................: 0.50%  ✓ 50        ✗ 9950
http_req_receiving.............: avg=200µs    min=50µs   med=150µs   max=5ms     p(90)=300µs   p(95)=500µs
http_req_sending...............: avg=100µs    min=20µs   med=80µs    max=2ms     p(90)=150µs   p(95)=200µs
http_req_tls_handshaking.......: avg=500µs    min=0s     med=0s      max=100ms   p(90)=0s      p(95)=0s
http_req_waiting...............: avg=149ms    min=49ms   med=119ms   max=1.99s   p(90)=249ms   p(95)=349ms
http_reqs......................: 10000  166.666667/s
iteration_duration.............: avg=6s       min=5s     med=6s      max=8s      p(90)=7s      p(95)=7.5s
iterations.....................: 10000  166.666667/s
vus............................: 100    min=0       max=100
vus_max........................: 100    min=100     max=100
```

### Key Metrics to Watch

1. **http_req_duration**: Response time percentiles
2. **http_req_failed**: Error rate
3. **http_reqs**: Requests per second
4. **checks**: Success rate of assertions

## 🐛 Troubleshooting

### High Response Times

1. Check database query performance
2. Verify caching is working
3. Check for N+1 queries
4. Review database indexes

### High Error Rates

1. Check application logs
2. Verify database connections
3. Check rate limiting configuration
4. Review error responses

### Memory Issues

1. Check for memory leaks
2. Review connection pooling
3. Verify cache eviction policies
4. Check for large payloads

### CPU Bottlenecks

1. Profile application code
2. Check for inefficient algorithms
3. Review database query plans
4. Verify proper indexing

## 🎯 Best Practices

1. **Start Small**: Begin with smoke tests
2. **Incremental Load**: Gradually increase load
3. **Monitor Everything**: Watch all metrics during tests
4. **Test Realistic Scenarios**: Use production-like data
5. **Test Different Endpoints**: Cover all critical paths
6. **Test Peak Times**: Simulate expected peak load
7. **Document Results**: Keep records of all tests
8. **Automate**: Integrate into CI/CD pipeline

## 🔄 Continuous Performance Testing

### GitHub Actions Integration

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install K6
        run: |
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update
          sudo apt-get install k6
      
      - name: Run Performance Tests
        run: k6 run --out json=results.json k8s/load-testing/k6-script.js
        env:
          BASE_URL: ${{ secrets.STAGING_URL }}
      
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: performance-results
          path: results.json
```

## 📚 Additional Resources

- [K6 Documentation](https://k6.io/docs/)
- [Performance Testing Best Practices](https://k6.io/docs/testing-guides/test-types/)
- [Grafana K6 Cloud](https://k6.io/cloud/)

---

**Built with ❤️ by Arman Hazrati**
