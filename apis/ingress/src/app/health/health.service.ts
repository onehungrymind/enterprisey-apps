import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ApiHealthResponse, ComponentHealth } from '@proto/api-interfaces';
import { DATABASE_CONNECTION } from '../database/database.providers';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(
    @Inject(DATABASE_CONNECTION) private dataSource: DataSource
  ) {}

  async check(): Promise<ApiHealthResponse> {
    const apiHealth = this.checkApi();
    const dbHealth = await this.checkDatabase();

    const overallStatus =
      dbHealth.status === 'unhealthy' || apiHealth.status === 'unhealthy'
        ? 'unhealthy'
        : dbHealth.status === 'degraded' || apiHealth.status === 'degraded'
        ? 'degraded'
        : 'healthy';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      api: apiHealth,
      database: dbHealth,
      uptime: process.uptime(),
    };
  }

  private checkApi(): ComponentHealth {
    return {
      name: 'ingress-api',
      status: 'healthy',
      responseTimeMs: Date.now() - this.startTime < 1000 ? 0 : 1,
    };
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      await this.dataSource.query('SELECT 1');
      return {
        name: 'sqlite',
        status: 'healthy',
        responseTimeMs: Date.now() - start,
      };
    } catch (e: any) {
      return {
        name: 'sqlite',
        status: 'unhealthy',
        responseTimeMs: Date.now() - start,
        message: e.message,
      };
    }
  }
}
