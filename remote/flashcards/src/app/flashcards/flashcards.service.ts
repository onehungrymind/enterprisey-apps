import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Flashcard } from '../database/entities/flashcard.entity';

@Injectable()
export class FlashcardsService {
  constructor(
    @Inject(getRepositoryToken(Flashcard))
    private flashcardsRepository: Repository<Flashcard>
  ) {}

  async findAll(): Promise<Flashcard[]> {
    return await this.flashcardsRepository.find();
  }

  async findOne(id: string): Promise<Flashcard | undefined> {
    return await this.flashcardsRepository.findOneBy({ id });
  }

  async get(id: string): Promise<Flashcard> {
    const flashcard = await this.flashcardsRepository.findOneBy({ id });
    if (!flashcard) throw new NotFoundException();
    return flashcard;
  }

  async create(flashcard: Flashcard): Promise<Flashcard> {
    return await this.flashcardsRepository.save(flashcard);
  }

  async update(flashcard: Flashcard): Promise<Flashcard> {
    return await this.flashcardsRepository.save(flashcard);
  }

  async remove(id: string): Promise<DeleteResult> {
    const flashcard = await this.flashcardsRepository.findOneBy({ id });
    if (!flashcard) throw new NotFoundException();
    return await this.flashcardsRepository.delete(id);
  }
}
