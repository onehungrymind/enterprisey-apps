import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockChallenge, mockEmptyChallenge } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { Challenge } from '../database/entities/challenge.entity';
import { ChallengesService } from './challenges.service';

describe('ChallengesService', () => {
  let service: ChallengesService;
  let repository: Repository<Challenge>;

  const challenge = { ...mockChallenge } as Challenge;
  const emptyChallenge = { ...mockEmptyChallenge } as Challenge;
  const repositoryToken = getRepositoryToken(Challenge);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengesService,
        {
          provide: repositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ChallengesService>(ChallengesService);
    repository = module.get<Repository<Challenge>>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find() on service.findAll()', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([challenge]);

    const result = await service.findAll();

    expect(result).toStrictEqual([challenge]);
  });

  it('findOneBy() on service.findOne()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(challenge);

    const result = await service.findOne(challenge.id);

    expect(result).toStrictEqual(challenge);
  });

  it('findOneBy() on service.get()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(challenge);

    const result = await service.get(challenge.id);

    expect(result).toStrictEqual(challenge);
  });

  it('findOneBy() on service.get() error', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    await expect(service.get(challenge.id)).rejects.toThrow(NotFoundException);
  });

  it('save() on service.create()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(emptyChallenge);

    const result = await service.create(emptyChallenge);

    expect(result).toStrictEqual(emptyChallenge);
  });

  it('save() on service.update()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(challenge);

    const result = await service.update(challenge);

    expect(result).toStrictEqual(challenge);
  });

  it('delete() on service.remove()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(challenge);
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as DeleteResult);

    const result = await service.remove(challenge.id);

    expect(result).toStrictEqual({});
  });

  it('delete() on service.remove() error', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

    await expect(service.remove(challenge.id)).rejects.toThrow(
      NotFoundException
    );
  });
});
