import { Test, TestingModule } from '@nestjs/testing';
import { FlashcardsService } from './flashcards.service';

describe('FlashcardsService', () => {
  let service: FlashcardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlashcardsService],
    }).compile();

    service = module.get<FlashcardsService>(FlashcardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
