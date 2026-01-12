/**
 * Northstar Platform - Deployment Verification Script
 * @author Arman Hazrati
 * @description Comprehensive pre-deployment verification checks
 * @license MIT
 * Copyright (c) 2024-2026 Arman Hazrati. All Rights Reserved.
 */

import * as fs from 'fs';
import * as path from 'path';

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
}

const results: CheckResult[] = [];

function check(name: string, condition: boolean, passMsg: string, failMsg: string) {
  results.push({
    name,
    status: condition ? 'PASS' : 'FAIL',
    message: condition ? passMsg : failMsg,
  });
}

function warn(name: string, message: string) {
  results.push({
    name,
    status: 'WARN',
    message,
  });
}

console.log('\n' + '═'.repeat(70));
console.log('  NORTHSTAR PLATFORM - DEPLOYMENT VERIFICATION');
console.log('  Author: Arman Hazrati');
console.log('═'.repeat(70) + '\n');

// Check 1: Required files exist
check(
  'Required Files',
  fs.existsSync('package.json') &&
    fs.existsSync('tsconfig.json') &&
    fs.existsSync('prisma/schema.prisma') &&
    fs.existsSync('Dockerfile'),
  'All required configuration files present',
  'Missing critical configuration files',
);

// Check 2: Environment template
check(
  'Environment Template',
  fs.existsSync('ENV_TEMPLATE.txt') || fs.existsSync('.env.example'),
  'Environment template file present',
  'Environment template missing',
);

// Check 3: Docker configuration
check(
  'Docker Files',
  fs.existsSync('Dockerfile') &&
    fs.existsSync('docker-compose.yml') &&
    fs.existsSync('.dockerignore'),
  'Docker configuration complete',
  'Docker files incomplete',
);

// Check 4: Kubernetes manifests
const k8sFiles = [
  'k8s/namespace.yaml',
  'k8s/deployment-backend.yaml',
  'k8s/deployment-postgres.yaml',
  'k8s/deployment-redis.yaml',
];
const k8sExists = k8sFiles.every((f) => fs.existsSync(f));
check(
  'Kubernetes Manifests',
  k8sExists,
  'Kubernetes configuration complete',
  'Kubernetes manifests incomplete',
);

// Check 5: Documentation
const docs = ['README.md', 'SECURITY.md', 'CONTRIBUTING.md', 'LICENSE'];
const docsExist = docs.every((f) => fs.existsSync(f));
check('Documentation', docsExist, 'All required documentation present', 'Missing documentation');

// Check 6: Test files
check(
  'Test Configuration',
  fs.existsSync('test/app.e2e-spec.ts') && fs.existsSync('test/jest-e2e.json'),
  'Test configuration present',
  'Test files missing',
);

// Check 7: Client build
check(
  'Client Configuration',
  fs.existsSync('client/package.json') &&
    fs.existsSync('client/tsconfig.json') &&
    fs.existsSync('client/next.config.js'),
  'Client configuration complete',
  'Client configuration incomplete',
);

// Check 8: Attribution files
check(
  'Attribution Files',
  fs.existsSync('ATTRIBUTION.md') && fs.existsSync('.attribution'),
  'Attribution and copyright files present',
  'Attribution files missing',
);

// Check 9: Package.json validation
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  check(
    'Package Metadata',
    pkg.name && pkg.version && pkg.author,
    `Package metadata complete (v${pkg.version})`,
    'Package metadata incomplete',
  );

  check(
    'Author Attribution',
    pkg.author && pkg.author.includes('Arman Hazrati'),
    'Author correctly attributed in package.json',
    'Author attribution missing in package.json',
  );
}

// Check 10: .gitignore
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf-8');
  check(
    '.gitignore Configuration',
    gitignore.includes('node_modules') &&
      gitignore.includes('.env') &&
      gitignore.includes('dist'),
    '.gitignore properly configured',
    '.gitignore missing critical entries',
  );
}

// Check 11: License file
if (fs.existsSync('LICENSE')) {
  const license = fs.readFileSync('LICENSE', 'utf-8');
  check(
    'License Attribution',
    license.includes('Arman Hazrati') && license.includes('MIT'),
    'License properly attributed',
    'License attribution incomplete',
  );
}

// Warnings for production
if (!fs.existsSync('.env')) {
  warn('Environment File', '.env file not found - remember to create before deployment');
}

if (fs.existsSync('node_modules')) {
  warn('Dependencies', 'node_modules present - ensure dependencies are up to date');
}

// Print results
console.log('\n📊 VERIFICATION RESULTS:\n');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

results.forEach((result) => {
  const icon =
    result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${result.name}`);
  console.log(`   ${result.message}\n`);

  if (result.status === 'PASS') passCount++;
  else if (result.status === 'FAIL') failCount++;
  else warnCount++;
});

console.log('═'.repeat(70));
console.log(`\n📈 SUMMARY: ${passCount} passed, ${failCount} failed, ${warnCount} warnings\n`);

if (failCount === 0) {
  console.log('✅ VERIFICATION PASSED - Project is ready for deployment!\n');
  console.log('Next steps:');
  console.log('  1. Ensure .env file is configured with production values');
  console.log('  2. Run: npm run test && npm run test:e2e');
  console.log('  3. Build Docker images: docker build -t northstar-backend .');
  console.log('  4. Deploy to your hosting platform\n');
} else {
  console.log('❌ VERIFICATION FAILED - Please fix the issues above\n');
  process.exit(1);
}

console.log('═'.repeat(70));
console.log('Northstar Platform by Arman Hazrati');
console.log('═'.repeat(70) + '\n');
