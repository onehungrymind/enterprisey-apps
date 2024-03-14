import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockEmptyFeature, mockFeature } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { Feature } from '../database/entities/feature.entity';
import { FeaturesService } from './features.service';

describe('FeaturesService', () => {
  let service: FeaturesService;
  let repository: Repository<Feature>;

  const feature = { ...mockFeature } as Feature;
  const emptyFeature = { ...mockEmptyFeature } as Feature;
  const repositoryToken = getRepositoryToken(Feature);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        {
          provide: repositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FeaturesService>(FeaturesService);
    repository = module.get<Repository<Feature>>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find() on service.findAll()', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([feature]);

    const result = await service.findAll();

    expect(result).toStrictEqual([feature]);
  });

  it('findOneBy() on service.findOne()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(feature);

    const result = await service.findOne(feature.id);

    expect(result).toStrictEqual(feature);
  });

  it('findOneBy() on service.get()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(feature);

    const result = await service.get(feature.id);

    expect(result).toStrictEqual(feature);
  });

  it('findOneBy() on service.get() error', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    await expect(service.get(feature.id)).rejects.toThrow(NotFoundException);
  });

  it('save() on service.create()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(emptyFeature);

    const result = await service.create(emptyFeature);

    expect(result).toStrictEqual(emptyFeature);
  });

  it('save() on service.update()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(feature);

    const result = await service.update(feature);

    expect(result).toStrictEqual(feature);
  });

  it('delete() on service.remove()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(feature);
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as DeleteResult);

    const result = await service.remove(feature.id);

    expect(result).toStrictEqual({});
  });

  it('delete() on service.remove() error', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

    await expect(service.remove(feature.id)).rejects.toThrow(NotFoundException);
  });
});
