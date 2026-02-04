import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockChallenge } from '@proto/testing';
import { ChallengesService } from './challenges.service';
describe('ChallengesService', () => {
  const model = 'challenges';
  let httpTestingController: HttpTestingController;
  let service: ChallengesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ChallengesService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should call http.', () => {
    it('get() on service.all()', () => {
      service.all().subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });
      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush([mockChallenge]);
      httpTestingController.verify();
    });
    it('get(url(model.id)) on service.find(model.id)', () => {
      service.find(mockChallenge.id as string).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });
    it('post(url, model) on service.create(model)', () => {
      service.create(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });
      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush(mockChallenge);
      httpTestingController.verify();
    });
    it('put(url(model.id), model) on service.create(model)', () => {
      service.update(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });
    it('delete(url(model.id)) on service.delete(model.id)', () => {
      service.delete(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });
  });
});
