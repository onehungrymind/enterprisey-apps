import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { challengeProviders } from './challenge.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ChallengesController],
  providers: [...challengeProviders, ChallengesService],
  exports: [ChallengesService],
})
export class ChallengesModule {}
