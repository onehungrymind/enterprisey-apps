import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { featureProviders } from './feature.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FeaturesController],
  providers: [...featureProviders, FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
