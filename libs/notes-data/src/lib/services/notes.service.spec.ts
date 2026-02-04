import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockNote } from '@proto/testing';
import { NotesService } from './notes.service';
describe('NotesService', () => {
  const model = 'notes';
  let httpTestingController: HttpTestingController;
  let service: NotesService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(NotesService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('should call http.', () => {
    it('get() on service.all()', () => {
      service.all().subscribe((res) => {
        expect(res).toEqual(mockNote);
      });
      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush([mockNote]);
      httpTestingController.verify();
    });
    it('get(url(model.id)) on service.find(model.id)', () => {
      service.find(mockNote.id as string).subscribe((res) => {
        expect(res).toEqual(mockNote);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockNote.id)
      );
      req.flush(mockNote);
      httpTestingController.verify();
    });
    it('post(url, model) on service.create(model)', () => {
      service.create(mockNote).subscribe((res) => {
        expect(res).toEqual(mockNote);
      });
      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush(mockNote);
      httpTestingController.verify();
    });
    it('put(url(model.id), model) on service.create(model)', () => {
      service.update(mockNote).subscribe((res) => {
        expect(res).toEqual(mockNote);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockNote.id)
      );
      req.flush(mockNote);
      httpTestingController.verify();
    });
    it('delete(url(model.id)) on service.delete(model.id)', () => {
      service.delete(mockNote).subscribe((res) => {
        expect(res).toEqual(mockNote);
      });
      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockNote.id)
      );
      req.flush(mockNote);
      httpTestingController.verify();
    });
  });
});
