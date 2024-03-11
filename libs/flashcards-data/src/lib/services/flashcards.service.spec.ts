import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockFlashcard } from '@proto/testing';

import { FlashcardsService } from './flashcards.service';

describe('FlashcardsService', () => {
  const model = 'flashcards';
  let httpTestingController: HttpTestingController;
  let service: FlashcardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FlashcardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should call http.', () => {
    it('get() on service.all()', () => {
      service.all().subscribe((res) => {
        expect(res).toEqual(mockFlashcard);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush([mockFlashcard]);
      httpTestingController.verify();
    });

    it('get(url(model.id)) on service.find(model.id)', () => {
      service.find(mockFlashcard.id as string).subscribe((res) => {
        expect(res).toEqual(mockFlashcard);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockFlashcard.id)
      );
      req.flush(mockFlashcard);
      httpTestingController.verify();
    });

    it('post(url, model) on service.create(model)', () => {
      service.create(mockFlashcard).subscribe((res) => {
        expect(res).toEqual(mockFlashcard);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush(mockFlashcard);
      httpTestingController.verify();
    });

    it('put(url(model.id), model) on service.create(model)', () => {
      service.update(mockFlashcard).subscribe((res) => {
        expect(res).toEqual(mockFlashcard);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockFlashcard.id)
      );
      req.flush(mockFlashcard);
      httpTestingController.verify();
    });

    it('delete(url(model.id)) on service.delete(model.id)', () => {
      service.delete(mockFlashcard).subscribe((res) => {
        expect(res).toEqual(mockFlashcard);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockFlashcard.id)
      );
      req.flush(mockFlashcard);
      httpTestingController.verify();
    });
  });
});
