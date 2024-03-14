import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { Feature } from '../database/entities/feature.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeaturesService {
  constructor(
    @Inject('FEATURE_REPOSITORY')
    private featuresRepository: Repository<Feature>,
    private configService: ConfigService
  ) {
    // FOR DEMONSTRATION PURPOSES ONLY
    // const API_KEY = this.configService.get<string>('SUPER_SECRET_API_KEY');
    // console.log('👉 THE API_KEY IS: ', API_KEY);
  }

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
