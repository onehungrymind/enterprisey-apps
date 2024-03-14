import { Test, TestingModule } from '@nestjs/testing';
import { TourService } from './tour.service';

describe('TourService', () => {
  let service: TourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourService],
    }).compile();

    service = module.get<TourService>(TourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
