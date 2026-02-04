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
import { Widget } from '../database/entities/widget.entity';
import { WidgetsService } from './widgets.service';
import { JwtAuthGuard, RolesGuard } from '@proto/guards/remote-auth';

@Controller('dashboards/:dashboardId/widgets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WidgetsController {
  constructor(private readonly widgetsService: WidgetsService) {}

  @Post()
  create(
    @Param('dashboardId') dashboardId: string,
    @Body() widget: Widget,
  ): Promise<Widget> {
    widget.dashboardId = dashboardId;
    return this.widgetsService.create(widget);
  }

  @Get()
  findAll(@Param('dashboardId') dashboardId: string): Promise<Widget[]> {
    return this.widgetsService.findByDashboardId(dashboardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Widget> {
    return this.widgetsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('dashboardId') dashboardId: string,
    @Param('id') id: string,
    @Body() widget: Widget,
  ) {
    widget.dashboardId = dashboardId;
    return this.widgetsService.update(widget);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.widgetsService.remove(id);
  }
}
