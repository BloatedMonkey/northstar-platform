import { Module } from '@nestjs/common';
import { ObservabilityController } from './observability.controller';
import { MetricsController } from './metrics.controller';
import { ObservabilityService } from './observability.service';

@Module({
  controllers: [ObservabilityController, MetricsController],
  providers: [ObservabilityService],
})
export class ObservabilityModule {}
