import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check([
      async () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }
}
