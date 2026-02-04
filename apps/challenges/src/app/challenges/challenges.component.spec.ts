import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { ChallengesFacade } from '@proto/challenges-state';
import { mockChallenge, mockEmptyChallenge } from '@proto/testing';
import { ChallengesComponent } from './challenges.component';
describe('ChallengesComponent', () => {
  let component: ChallengesComponent;
  let fixture: ComponentFixture<ChallengesComponent>;
  let de: DebugElement;
  let challengesFacade: ChallengesFacade;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesComponent, NoopAnimationsModule],
      providers: [provideMockStore({})],
    }).compileComponents();
    fixture = TestBed.createComponent(ChallengesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    challengesFacade = TestBed.inject(ChallengesFacade);
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should on select call challengesFacade selectChallenge', () => {
    const spy = jest.spyOn(challengesFacade, 'selectChallenge');
    component.selectChallenge(mockChallenge);
    expect(spy).toHaveBeenCalledWith(mockChallenge.id);
  });
  describe('should on save call ChallengesFacade', () => {
    it('updateChallenge', () => {
      const spy = jest.spyOn(challengesFacade, 'updateChallenge');
      component.saveChallenge(mockChallenge);
      expect(spy).toHaveBeenCalledWith(mockChallenge);
    });
    it('createChallenge', () => {
      const spy = jest.spyOn(challengesFacade, 'createChallenge');
      component.saveChallenge(mockEmptyChallenge);
      expect(spy).toHaveBeenCalledWith(mockEmptyChallenge);
    });
  });
  it('should on delete call ChallengesFacade deleteChallenge', () => {
    const spy = jest.spyOn(challengesFacade, 'deleteChallenge');
    component.deleteChallenge(mockChallenge);
    expect(spy).toHaveBeenCalledWith(mockChallenge);
  });
});
