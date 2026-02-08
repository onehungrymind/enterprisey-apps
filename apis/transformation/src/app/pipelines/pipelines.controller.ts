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
import { PipelineEntity } from '../database/entities/pipeline.entity';
import { PipelinesService } from './pipelines.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@proto/guards/remote-auth';

@Controller('pipelines')
export class PipelinesController {
  constructor(
    private readonly pipelinesService: PipelinesService,
  ) {}

  @Post()
  @Roles(['admin', 'manager'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() pipeline: PipelineEntity): Promise<PipelineEntity> {
    return this.pipelinesService.create(pipeline);
  }

  @Get()
  findAll(): Promise<PipelineEntity[]> {
    return this.pipelinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PipelineEntity> {
    return this.pipelinesService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin', 'manager'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() pipeline: PipelineEntity) {
    return this.pipelinesService.update(pipeline);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.pipelinesService.remove(id);
  }

  @Post(':id/run')
  @Roles(['admin', 'manager'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  run(@Param('id') id: string) {
    return this.pipelinesService.run(id);
  }

  @Get(':id/preview')
  preview(@Param('id') id: string) {
    return this.pipelinesService.preview(id);
  }

  @Get(':id/runs')
  getRuns(@Param('id') id: string) {
    return this.pipelinesService.getRuns(id);
  }
}
