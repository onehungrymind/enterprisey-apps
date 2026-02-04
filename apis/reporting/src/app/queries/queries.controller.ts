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
import { ReportQuery } from '../database/entities/report-query.entity';
import { QueriesService } from './queries.service';
import { JwtAuthGuard, RolesGuard } from '@proto/guards/remote-auth';

@Controller('queries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post()
  create(@Body() query: ReportQuery): Promise<ReportQuery> {
    return this.queriesService.create(query);
  }

  @Get()
  findAll(): Promise<ReportQuery[]> {
    return this.queriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ReportQuery> {
    return this.queriesService.findOne(id);
  }

  @Get(':id/execute')
  execute(@Param('id') id: string) {
    return this.queriesService.execute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() query: ReportQuery) {
    return this.queriesService.update(query);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queriesService.remove(id);
  }
}
