import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardsController } from './flashcards.controller';
import { FlashcardsService } from './flashcards.service';

describe('FlashcardsController', () => {
  let controller: FlashcardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlashcardsController],
      providers: [FlashcardsService],
    }).compile();

    controller = module.get<FlashcardsController>(FlashcardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
