import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { queryProviders } from './query.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [QueriesController],
  providers: [...queryProviders, QueriesService],
  exports: [QueriesService],
})
export class QueriesModule {}
