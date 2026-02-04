import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SourcesModule } from './sources/sources.module';
import { SchemasModule } from './schemas/schemas.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SourcesModule,
    SchemasModule,
  ],
})
export class AppModule {}
