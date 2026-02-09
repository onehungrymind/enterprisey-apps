import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Dashboard } from '../database/entities/dashboard.entity';
import { DashboardsService } from './dashboards.service';
import { JwtAuthGuard, RolesGuard } from '@proto/guards/remote-auth';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dashboard: Dashboard): Promise<Dashboard> {
    return this.dashboardsService.create(dashboard);
  }

  @Get()
  findAll(): Promise<Dashboard[]> {
    return this.dashboardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Dashboard> {
    return this.dashboardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dashboard: Dashboard) {
    return this.dashboardsService.update(dashboard);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.dashboardsService.remove(id);
  }
}
