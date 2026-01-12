/**
 * @author Arman Hazrati
 * K6 load testing script for Northstar API
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '1m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '2m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 50 },   // Ramp down to 50 users
    { duration: '30s', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
    errors: ['rate<0.1'],             // Custom error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123',
  name: 'Load Test User',
};

let authToken = '';

export function setup() {
  // Register a test user
  const registerRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
    email: testUser.email,
    password: testUser.password,
    name: testUser.name,
    role: 'CUSTOMER',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'user registered successfully': (r) => r.status === 201,
  });

  return { token: registerRes.json('accessToken') };
}

export default function (data) {
  // Test 1: Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check returns ok': (r) => r.json('status') === 'ok',
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: Login
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: testUser.email,
    password: testUser.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200 || r.status === 201,
    'received access token': (r) => r.json('accessToken') !== undefined,
  }) || errorRate.add(1);

  const token = loginRes.json('accessToken') || data.token;

  sleep(1);

  // Test 3: Get user profile
  const profileRes = http.get(`${BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(profileRes, {
    'profile fetch successful': (r) => r.status === 200,
    'profile has email': (r) => r.json('email') !== undefined,
  }) || errorRate.add(1);

  sleep(1);

  // Test 4: Get metrics
  const metricsRes = http.get(`${BASE_URL}/observability/metrics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(metricsRes, {
    'metrics fetch successful': (r) => r.status === 200,
  }) || errorRate.add(1);

  sleep(2);
}

export function teardown(data) {
  console.log('Load test completed');
}
