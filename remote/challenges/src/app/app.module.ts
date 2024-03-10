import { Module } from '@nestjs/common';
import { ChallengesModule } from './challenges/challenges.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ChallengesModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
