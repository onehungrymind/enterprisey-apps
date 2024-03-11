import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockUser } from '@proto/testing';

import { UsersService } from './users.service';

describe('UsersService', () => {
  const model = 'users';
  let httpTestingController: HttpTestingController;
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should call http.', () => {
    it('get() on service.all()', () => {
      service.all().subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush([mockUser]);
      httpTestingController.verify();
    });

    it('get(url(model.id)) on service.find(model.id)', () => {
      service.find(mockUser.id as string).subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockUser.id)
      );
      req.flush(mockUser);
      httpTestingController.verify();
    });

    it('post(url, model) on service.create(model)', () => {
      service.create(mockUser).subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush(mockUser);
      httpTestingController.verify();
    });

    it('put(url(model.id), model) on service.create(model)', () => {
      service.update(mockUser).subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockUser.id)
      );
      req.flush(mockUser);
      httpTestingController.verify();
    });

    it('delete(url(model.id)) on service.delete(model.id)', () => {
      service.delete(mockUser).subscribe((res) => {
        expect(res).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockUser.id)
      );
      req.flush(mockUser);
      httpTestingController.verify();
    });
  });
});
