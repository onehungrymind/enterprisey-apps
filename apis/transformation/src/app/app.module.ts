import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PipelinesModule } from './pipelines/pipelines.module';
import { StepsModule } from './steps/steps.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    PipelinesModule,
    StepsModule,
    HealthModule,
  ],
})
export class AppModule {}
