import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ExportJobEntity } from '../database/entities/export-job.entity';
import { JobsService } from './jobs.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@proto/guards/remote-auth';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
  ) {}

  @Post()
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() job: ExportJobEntity): Promise<ExportJobEntity> {
    return this.jobsService.create(job);
  }

  @Get()
  findAll(): Promise<ExportJobEntity[]> {
    return this.jobsService.findAll();
  }

  @Get('active')
  findActive(): Promise<ExportJobEntity[]> {
    return this.jobsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExportJobEntity> {
    return this.jobsService.findOne(id);
  }

  @Post(':id/cancel')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  cancel(@Param('id') id: string): Promise<ExportJobEntity> {
    return this.jobsService.cancel(id);
  }

  @Delete(':id')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.jobsService.remove(id);
  }
}
