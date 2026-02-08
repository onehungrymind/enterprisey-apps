import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SourcesModule } from './sources/sources.module';
import { SchemasModule } from './schemas/schemas.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SourcesModule,
    SchemasModule,
    HealthModule,
    WebhooksModule,
    UploadsModule,
  ],
})
export class AppModule {}
