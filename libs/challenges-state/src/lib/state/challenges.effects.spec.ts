import { Challenge } from '@proto/api-interfaces';
import { ChallengesService } from '@proto/challenges-data';
import { mockChallenge, mockChallengesService } from '@proto/testing';
import { of, throwError } from 'rxjs';

import { ChallengesActions } from './challenges.actions';
import * as ChallengesEffects from './challenges.effects';

describe('ChallengesEffects', () => {
  const service = mockChallengesService as unknown as ChallengesService;

  describe('loadChallenges$', () => {
    it('should return loadChallengesSuccess, on success', (done) => {
      const challenges: Challenge[] = [];
      const action$ = of(ChallengesActions.loadChallenges());

      service.all = jest.fn(() => of(challenges));

      ChallengesEffects.loadChallenges(action$, service).subscribe((action) => {
        expect(action).toEqual(
          ChallengesActions.loadChallengesSuccess({ challenges })
        );
        done();
      });
    });

    it('should return loadChallengesFailure, on failure', (done) => {
      const error = new Error();
      const action$ = of(ChallengesActions.loadChallenges());

      service.all = jest.fn(() => throwError(() => error));

      ChallengesEffects.loadChallenges(action$, service).subscribe((action) => {
        expect(action).toEqual(
          ChallengesActions.loadChallengesFailure({ error })
        );
        done();
      });
    });
  });

  describe('loadChallenge$', () => {
    it('should return success with challenge', (done) => {
      const challenge = { ...mockChallenge };
      const action$ = of(
        ChallengesActions.loadChallenge({ challengeId: challenge.id as string })
      );

      service.find = jest.fn(() => of(challenge));

      ChallengesEffects.loadChallenge(action$, service).subscribe((action) => {
        expect(action).toEqual(
          ChallengesActions.loadChallengeSuccess({ challenge })
        );
        done();
      });
    });

    it('should return failure', (done) => {
      const error = new Error();
      const challenge = { ...mockChallenge };
      const action$ = of(
        ChallengesActions.loadChallenge({ challengeId: challenge.id as string })
      );

      service.find = jest.fn(() => throwError(() => error));

      ChallengesEffects.loadChallenge(action$, service).subscribe((action) => {
        expect(action).toEqual(
          ChallengesActions.loadChallengeFailure({ error })
        );
        done();
      });
    });
  });

  describe('createChallenge$', () => {
    it('should return success with challenge', (done) => {
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.createChallenge({ challenge }));

      mockChallengesService.create = jest.fn(() => of(challenge));

      ChallengesEffects.createChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.createChallengeSuccess({ challenge })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.createChallenge({ challenge }));

      service.create = jest.fn(() => throwError(() => error));

      ChallengesEffects.createChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.createChallengeFailure({ error })
          );
          done();
        }
      );
    });
  });

  describe('updateChallenge$', () => {
    it('should return success with challenge', (done) => {
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.updateChallenge({ challenge }));

      mockChallengesService.update = jest.fn(() => of(challenge));

      ChallengesEffects.updateChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.updateChallengeSuccess({ challenge })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.updateChallenge({ challenge }));

      service.update = jest.fn(() => throwError(() => error));

      ChallengesEffects.updateChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.updateChallengeFailure({ error })
          );
          done();
        }
      );
    });
  });

  describe('deleteChallenge$', () => {
    it('should return success with challenge', (done) => {
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.deleteChallenge({ challenge }));

      mockChallengesService.delete = jest.fn(() => of(challenge));

      ChallengesEffects.deleteChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.deleteChallengeSuccess({ challenge })
          );
          done();
        }
      );
    });

    it('should return failure', (done) => {
      const error = new Error();
      const challenge = { ...mockChallenge };
      const action$ = of(ChallengesActions.deleteChallenge({ challenge }));

      service.delete = jest.fn(() => throwError(() => error));

      ChallengesEffects.deleteChallenge(action$, service).subscribe(
        (action) => {
          expect(action).toEqual(
            ChallengesActions.deleteChallengeFailure({ error })
          );
          done();
        }
      );
    });
  });
});
