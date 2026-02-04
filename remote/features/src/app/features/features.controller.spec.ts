import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyFeature, mockFeature } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';
import { Feature } from '../database/entities/feature.entity';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;
  const feature = { ...mockFeature } as Feature;
  const emptyFeature = { ...mockEmptyFeature } as Feature;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturesController],
      providers: [
        ConfigService,
        FeaturesService,
        {
          provide: 'FEATURE_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    controller = module.get<FeaturesController>(FeaturesController);
    service = module.get<FeaturesService>(FeaturesService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('create()', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(feature);
    const result = await controller.create(emptyFeature);
    expect(result).toStrictEqual(feature);
  });
  it('findAll()', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([feature]);
    const result = await controller.findAll();
    expect(result).toStrictEqual([feature]);
  });
  it('findOne()', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(feature);
    const result = await service.findOne(feature.id);
    expect(result).toStrictEqual(feature);
  });
  it('update()', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(feature);
    const result = await controller.update(feature.id, feature);
    expect(result).toStrictEqual(feature);
  });
  it('remove()', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({} as DeleteResult);
    const result = await controller.remove(feature.id);
    expect(result).toStrictEqual({});
  });
});
