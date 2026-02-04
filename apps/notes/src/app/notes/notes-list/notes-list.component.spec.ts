import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesListComponent } from './notes-list.component';
describe('NotesListComponent', () => {
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
