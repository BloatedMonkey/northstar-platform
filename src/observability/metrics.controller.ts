/**
 * @author Arman Hazrati
 * Prometheus metrics endpoint
 */
import { Controller, Get, Header } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { ObservabilityService } from './observability.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly observabilityService: ObservabilityService) {}

  @Get()
  @Public()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    const metrics = await this.observabilityService.getMetrics();

    // Convert to Prometheus format
    let output = '';

    // Application metrics
    output += `# HELP northstar_users_total Total number of users\n`;
    output += `# TYPE northstar_users_total gauge\n`;
    output += `northstar_users_total ${metrics.users.total}\n\n`;

    output += `# HELP northstar_users_active Active users\n`;
    output += `# TYPE northstar_users_active gauge\n`;
    output += `northstar_users_active ${metrics.users.active}\n\n`;

    // Service request metrics
    output += `# HELP northstar_service_requests_total Total service requests\n`;
    output += `# TYPE northstar_service_requests_total gauge\n`;
    output += `northstar_service_requests_total ${metrics.serviceRequests.total}\n\n`;

    output += `# HELP northstar_service_requests_completed Completed service requests\n`;
    output += `# TYPE northstar_service_requests_completed gauge\n`;
    output += `northstar_service_requests_completed ${metrics.serviceRequests.completed}\n\n`;

    // Provider response metrics
    output += `# HELP northstar_provider_responses_pending Pending provider responses\n`;
    output += `# TYPE northstar_provider_responses_pending gauge\n`;
    output += `northstar_provider_responses_pending ${metrics.providerResponses.pending}\n\n`;

    return output;
  }
}
