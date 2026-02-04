import { Test, TestingModule } from '@nestjs/testing';
import { mockEmptyFlashcard, mockFlashcard } from '@proto/testing';
import { DeleteResult, Repository } from 'typeorm';
import { Flashcard } from '../database/entities/flashcard.entity';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';
describe('FlashcardsController', () => {
  let controller: FlashcardsController;
  let service: FlashcardsService;
  const flashcard = { ...mockFlashcard } as Flashcard;
  const emptyFlashcard = { ...mockEmptyFlashcard } as Flashcard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [
        FlashcardsService,
        {
          provide: 'FLASHCARD_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();
    controller = module.get<FlashcardsController>(FlashcardsController);
    service = module.get<FlashcardsService>(FlashcardsService);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('create()', async () => {
    jest.spyOn(service, 'create').mockResolvedValueOnce(flashcard);
    const result = await controller.create(emptyFlashcard);
    expect(result).toStrictEqual(flashcard);
  });
  it('findAll()', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValueOnce([flashcard]);
    const result = await controller.findAll();
    expect(result).toStrictEqual([flashcard]);
  });
  it('findOne()', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(flashcard);
    const result = await service.findOne(flashcard.id);
    expect(result).toStrictEqual(flashcard);
  });
  it('update()', async () => {
    jest.spyOn(service, 'update').mockResolvedValueOnce(flashcard);
    const result = await controller.update(flashcard.id, flashcard);
    expect(result).toStrictEqual(flashcard);
  });
  it('remove()', async () => {
    jest.spyOn(service, 'remove').mockResolvedValueOnce({} as DeleteResult);
    const result = await controller.remove(flashcard.id);
    expect(result).toStrictEqual({});
  });
});
