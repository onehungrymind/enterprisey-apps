import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { Challenge } from '../database/entities/challenge.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @Inject('CHALLENGE_REPOSITORY')
    private challengesRepository: Repository<Challenge>
  ) {}

  async findAll(): Promise<Challenge[]> {
    return await this.challengesRepository.find();
  }

  async findOne(id: string): Promise<Challenge | undefined> {
    return await this.challengesRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Challenge> {
    const challenge = await this.challengesRepository.findOneBy({ id });
    if (!challenge) throw new NotFoundException();
    return challenge;
  }

  async create(challenge: Challenge): Promise<Challenge> {
    return await this.challengesRepository.save(challenge);
  }

  async update(challenge: Challenge): Promise<Challenge> {
    return await this.challengesRepository.save(challenge);
  }

  async remove(id: string): Promise<DeleteResult> {
    const challenge = await this.challengesRepository.findOneBy({ id });
    if (!challenge) throw new NotFoundException();
    return await this.challengesRepository.delete(id);
  }
}
