import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockChallenge } from '@proto/testing';

import { ChallengeDetailsComponent } from './challenge-details.component';

describe('ChallengeDetailsComponent', () => {
  let component: ChallengeDetailsComponent;
  let fixture: ComponentFixture<ChallengeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDetailsComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeDetailsComponent);
    component = fixture.componentInstance;
    component.challenge = mockChallenge;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
