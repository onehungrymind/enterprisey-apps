import { TestBed } from '@angular/core/testing';
import { ActionsSubject } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { mockChallenge } from '@proto/testing';

import { ChallengesActions } from './challenges.actions';
import { ChallengesFacade } from './challenges.facade';
import { initialChallengesState } from './challenges.reducer';

describe('ChallengesFacade', () => {
  let facade: ChallengesFacade;
  let store: MockStore;

  const mockActionsSubject = new ActionsSubject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChallengesFacade,
        provideMockStore({ initialState: initialChallengesState }),
        { provide: ActionsSubject, useValue: mockActionsSubject },
      ],
    });

    facade = TestBed.inject(ChallengesFacade);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('should dispatch', () => {
    it('select on select(challenge.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.selectChallenge(mockChallenge.id as string);

      const action = ChallengesActions.selectChallenge({
        selectedId: mockChallenge.id as string,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('loadChallenges on loadChallenges()', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.loadChallenges();

      const action = ChallengesActions.loadChallenges();

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('loadChallenge on loadChallenge(challenge.id)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.loadChallenge(mockChallenge.id as string);

      const action = ChallengesActions.loadChallenge({
        challengeId: mockChallenge.id as string,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('createChallenge on createChallenge(challenge)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.createChallenge(mockChallenge);

      const action = ChallengesActions.createChallenge({
        challenge: mockChallenge,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('updateChallenge on updateChallenge(challenge)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.updateChallenge(mockChallenge);

      const action = ChallengesActions.updateChallenge({
        challenge: mockChallenge,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });

    it('delete on delete(model)', () => {
      const spy = jest.spyOn(store, 'dispatch');

      facade.deleteChallenge(mockChallenge);

      const action = ChallengesActions.deleteChallenge({
        challenge: mockChallenge,
      });

      expect(spy).toHaveBeenCalledWith(action);
    });
  });
});
