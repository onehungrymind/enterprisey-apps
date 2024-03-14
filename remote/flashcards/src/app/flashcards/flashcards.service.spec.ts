import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockEmptyFlashcard, mockFlashcard } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';

import { Flashcard } from '../database/entities/flashcard.entity';
import { FlashcardsService } from './flashcards.service';

describe('FlashcardsService', () => {
  let service: FlashcardsService;
  let repository: Repository<Flashcard>;

  const flashcard = { ...mockFlashcard } as Flashcard;
  const emptyFlashcard = { ...mockEmptyFlashcard } as Flashcard;
  const repositoryToken = getRepositoryToken(Flashcard);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlashcardsService,
        {
          provide: repositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FlashcardsService>(FlashcardsService);
    repository = module.get<Repository<Flashcard>>(repositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('find() on service.findAll()', async () => {
    jest.spyOn(repository, 'find').mockResolvedValueOnce([flashcard]);

    const result = await service.findAll();

    expect(result).toStrictEqual([flashcard]);
  });

  it('findOneBy() on service.findOne()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(flashcard);

    const result = await service.findOne(flashcard.id);

    expect(result).toStrictEqual(flashcard);
  });

  it('findOneBy() on service.get()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(flashcard);

    const result = await service.get(flashcard.id);

    expect(result).toStrictEqual(flashcard);
  });

  it('findOneBy() on service.get() error', async () => {
    jest
      .spyOn(repository, 'findOneBy')
      .mockRejectedValueOnce(new NotFoundException());

    await expect(service.get(flashcard.id)).rejects.toThrow(NotFoundException);
  });

  it('save() on service.create()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(emptyFlashcard);

    const result = await service.create(emptyFlashcard);

    expect(result).toStrictEqual(emptyFlashcard);
  });

  it('save() on service.update()', async () => {
    jest.spyOn(repository, 'save').mockResolvedValueOnce(flashcard);

    const result = await service.update(flashcard);

    expect(result).toStrictEqual(flashcard);
  });

  it('delete() on service.remove()', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(flashcard);
    jest.spyOn(repository, 'delete').mockResolvedValueOnce({} as DeleteResult);

    const result = await service.remove(flashcard.id);

    expect(result).toStrictEqual({});
  });

  it('delete() on service.remove() error', async () => {
    jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined);

    await expect(service.remove(flashcard.id)).rejects.toThrow(
      NotFoundException
    );
  });
});
