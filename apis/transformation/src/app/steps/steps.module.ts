import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { stepProviders } from './step.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [StepsController],
  providers: [...stepProviders, StepsService],
  exports: [StepsService],
})
export class StepsModule {}
