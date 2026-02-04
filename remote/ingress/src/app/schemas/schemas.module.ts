import { Module } from '@nestjs/common';
import { SchemasService } from './schemas.service';
import { SchemasController } from './schemas.controller';
import { schemaProviders } from './schema.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SchemasController],
  providers: [...schemaProviders, SchemasService],
  exports: [SchemasService],
})
export class SchemasModule {}
