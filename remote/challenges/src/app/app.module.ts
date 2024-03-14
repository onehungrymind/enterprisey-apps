import { Module } from '@nestjs/common';
import { ChallengesModule } from './challenges/challenges.module';
import { DatabaseModule } from './database/database.module';
import { TourModule } from './tour/tour.module';

@Module({
  imports: [ChallengesModule, DatabaseModule, TourModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
