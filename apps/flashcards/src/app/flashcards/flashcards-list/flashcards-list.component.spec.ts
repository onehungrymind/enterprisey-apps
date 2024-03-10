import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardsListComponent } from './flashcards-list.component';

describe('FlashcardsListComponent', () => {
  let component: FlashcardsListComponent;
  let fixture: ComponentFixture<FlashcardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlashcardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
