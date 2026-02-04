import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { dashboardProviders } from './dashboard.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DashboardsController],
  providers: [...dashboardProviders, DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
