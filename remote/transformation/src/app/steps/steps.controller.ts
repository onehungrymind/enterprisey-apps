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
import { TransformStepEntity } from '../database/entities/transform-step.entity';
import { StepsService } from './steps.service';
import { JwtAuthGuard, Roles, RolesGuard } from '@proto/guards/remote-auth';

@Controller('steps')
export class StepsController {
  constructor(
    private readonly stepsService: StepsService,
  ) {}

  @Post()
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() step: TransformStepEntity): Promise<TransformStepEntity> {
    return this.stepsService.create(step);
  }

  @Get()
  findAll(): Promise<TransformStepEntity[]> {
    return this.stepsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TransformStepEntity> {
    return this.stepsService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() step: TransformStepEntity) {
    return this.stepsService.update(step);
  }

  @Delete(':id')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.stepsService.remove(id);
  }

  @Patch(':id/reorder')
  @Roles(['admin', 'engineer'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  reorder(@Param('id') id: string, @Body('order') order: number) {
    return this.stepsService.reorder(id, order);
  }
}
