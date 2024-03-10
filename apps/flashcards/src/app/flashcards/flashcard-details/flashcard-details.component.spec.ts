import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardDetailsComponent } from './flashcard-details.component';

describe('FlashcardDetailsComponent', () => {
  let component: FlashcardDetailsComponent;
  let fixture: ComponentFixture<FlashcardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlashcardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
