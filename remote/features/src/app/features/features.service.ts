import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Feature } from '../database/entities/feature.entity';

@Injectable()
export class FeaturesService {
  constructor(
    @Inject('FEATURE_REPOSITORY')
    private featuresRepository: Repository<Feature>,
  ) {}

  async findAll(): Promise<Feature[]> {
    return await this.featuresRepository.find();
  }

  async findOne(id: string): Promise<Feature | undefined> {
    return await this.featuresRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Feature> {
    const feature = await this.featuresRepository.findOneBy({ id });
    if (!feature) throw new NotFoundException();
    return feature;
  }

  async create(feature: Feature): Promise<Feature> {
    return await this.featuresRepository.save(feature);
  }

  async update(feature: Feature): Promise<Feature> {
    return await this.featuresRepository.save(feature);
  }

  async remove(id: string): Promise<DeleteResult> {
    const feature = await this.featuresRepository.findOneBy({ id });
    if (!feature) throw new NotFoundException();
    return await this.featuresRepository.delete(id);
  }
}
