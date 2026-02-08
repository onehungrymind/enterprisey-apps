import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from '../database/database.module';
import { SchemasModule } from '../schemas/schemas.module';
import { sourceProviders } from '../sources/source.providers';

@Module({
  imports: [DatabaseModule, SchemasModule],
  controllers: [UploadsController],
  providers: [...sourceProviders],
})
export class UploadsModule {}
