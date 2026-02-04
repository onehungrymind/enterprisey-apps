import { Module } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';
import { sourceProviders } from './source.providers';
import { DatabaseModule } from '../database/database.module';
import { SchemasModule } from '../schemas/schemas.module';

@Module({
  imports: [DatabaseModule, SchemasModule],
  controllers: [SourcesController],
  providers: [...sourceProviders, SourcesService],
  exports: [SourcesService],
})
export class SourcesModule {}
