import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockFlashcard } from '@proto/testing';
import { FlashcardDetailsComponent } from './flashcard-details.component';
describe('FlashcardDetailsComponent', () => {
  let component: FlashcardDetailsComponent;
  let fixture: ComponentFixture<FlashcardDetailsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardDetailsComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FlashcardDetailsComponent);
    component = fixture.componentInstance;
    component.flashcard = mockFlashcard;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
