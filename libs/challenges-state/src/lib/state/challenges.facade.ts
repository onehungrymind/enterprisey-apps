import { Injectable, inject } from '@angular/core';
import { Action, Store, select } from '@ngrx/store';
import { Challenge } from '@proto/api-interfaces';
import { ChallengesActions } from './challenges.actions';
import * as ChallengesSelectors from './challenges.selectors';

@Injectable({
  providedIn: 'root',
})
export class ChallengesFacade {
  private readonly store = inject(Store);

  loaded$ = this.store.pipe(select(ChallengesSelectors.getChallengesLoaded));
  allChallenges$ = this.store.pipe(select(ChallengesSelectors.getAllChallenges));
  selectedChallenge$ = this.store.pipe(select(ChallengesSelectors.getSelectedChallenge));

  resetSelectedChallenge() {
    this.dispatch(ChallengesActions.resetSelectedChallenge());
  }

  selectChallenge(selectedId: string) {
    this.dispatch(ChallengesActions.selectChallenge({ selectedId }));
  }

  loadChallenges() {
    this.dispatch(ChallengesActions.loadChallenges());
  }

  loadChallenge(challengeId: string) {
    this.dispatch(ChallengesActions.loadChallenge({ challengeId }));
  }

  saveChallenge(challenge: Challenge) {
    if (challenge.id) {
      this.updateChallenge(challenge);
    } else {
      this.createChallenge(challenge);
    }
  }

  createChallenge(challenge: Challenge) {
    this.dispatch(ChallengesActions.createChallenge({ challenge }));
  }

  updateChallenge(challenge: Challenge) {
    this.dispatch(ChallengesActions.updateChallenge({ challenge }));
  }

  deleteChallenge(challenge: Challenge) {
    this.dispatch(ChallengesActions.deleteChallenge({ challenge }));
  }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
