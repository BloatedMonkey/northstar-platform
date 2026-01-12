/**
 * Northstar Platform - Integrations Controller
 * @author Arman Hazrati
 * @description API key protected endpoints for external integrations
 * @license MIT
 * Copyright (c) 2024-2026 Arman Hazrati. All Rights Reserved.
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(ApiKeyGuard)
@ApiSecurity('api-key')
export class IntegrationsController {
  @Get('status')
  @ApiOperation({ summary: 'Get integration status' })
  getStatus() {
    return {
      data: {
        status: 'active',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
