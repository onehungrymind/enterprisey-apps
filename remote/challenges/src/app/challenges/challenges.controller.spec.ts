import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

describe('ChallengesController', () => {
  let controller: ChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [ChallengesService],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
