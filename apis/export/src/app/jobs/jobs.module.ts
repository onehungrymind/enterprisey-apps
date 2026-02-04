import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { jobProviders } from './job.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [JobsController],
  providers: [...jobProviders, JobsService],
  exports: [JobsService],
})
export class JobsModule {}
