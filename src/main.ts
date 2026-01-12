/**
 * Northstar Backend - Main Application Entry Point
 *
 * @author Arman Hazrati
 * @description Production-grade service marketplace backend
 * @license MIT
 *
 * This is a portfolio project demonstrating enterprise-level
 * backend development with NestJS, TypeScript, and PostgreSQL.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';

async function bootstrap() {
  // Display copyright notice
  console.log('\n' + '═'.repeat(70));
  console.log('  NORTHSTAR PLATFORM - Enterprise Service Marketplace');
  console.log('  Author: Arman Hazrati | License: MIT');
  console.log('  Copyright © 2024-2026 Arman Hazrati. All Rights Reserved.');
  console.log('═'.repeat(70) + '\n');

  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
    }),
  );

  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['*'];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Correlation-Id',
      'X-Request-Id',
    ],
  });

  app.use(new CorrelationIdMiddleware().use);

  app.setGlobalPrefix(process.env.API_PREFIX || 'v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Northstar API')
    .setDescription('Service marketplace backend API - Portfolio project by Arman Hazrati')
    .setVersion('1.0')
    .setContact('Arman Hazrati', '', '')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', in: 'header', name: 'X-API-Key' }, 'api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(`API Documentation: http://localhost:${port}/api/docs`, 'Bootstrap');
  Logger.log(`Developed by Arman Hazrati - Portfolio Project`, 'Bootstrap');
}

bootstrap();
