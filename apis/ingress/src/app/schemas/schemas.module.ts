import { Module } from '@nestjs/common';
import { SchemasService } from './schemas.service';
import { SchemasController } from './schemas.controller';
import { schemaProviders } from './schema.providers';
import { sourceProviders } from '../sources/source.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SchemasController],
  providers: [...schemaProviders, ...sourceProviders, SchemasService],
  exports: [SchemasService],
})
export class SchemasModule {}
