import { Module } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { PipelinesController, RunsController } from './pipelines.controller';
import { pipelineProviders } from './pipeline.providers';
import { DatabaseModule } from '../database/database.module';
import { StepsModule } from '../steps/steps.module';

@Module({
  imports: [DatabaseModule, StepsModule],
  controllers: [PipelinesController, RunsController],
  providers: [...pipelineProviders, PipelinesService],
  exports: [PipelinesService],
})
export class PipelinesModule {}
