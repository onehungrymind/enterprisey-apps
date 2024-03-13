import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [FeaturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
