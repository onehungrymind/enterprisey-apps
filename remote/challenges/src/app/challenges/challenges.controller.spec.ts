import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockChallenge, mockEmptyChallenge } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { Challenge } from '../database/entities/challenge.entity';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';

describe('ChallengesController', () => {
  let controller: ChallengesController;
  let service: ChallengesService;

  const challenge = { ...mockChallenge } as Challenge;
  const emptyChallenge = { ...mockEmptyChallenge } as Challenge;
  const repositoryToken = getRepositoryToken(Challenge);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChallengesController],
      providers: [
        ChallengesService,
        {
          provide: repositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ChallengesController>(ChallengesController);
    service = module.get<ChallengesService>(ChallengesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create()', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(challenge);

    const result = await controller.create(emptyChallenge);

    expect(result).toStrictEqual(challenge);
  });

  it('findAll()', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([challenge]);

    const result = await controller.findAll();

    expect(result).toStrictEqual([challenge]);
  });

  it('findOne()', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(challenge);

    const result = await service.findOne(challenge.id);

    expect(result).toStrictEqual(challenge);
  });

  it('update()', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(challenge);

    const result = await controller.update(challenge.id, challenge);

    expect(result).toStrictEqual(challenge);
  });

  it('remove()', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({} as DeleteResult);

    const result = await controller.remove(challenge.id);

    expect(result).toStrictEqual({});
  });
});
