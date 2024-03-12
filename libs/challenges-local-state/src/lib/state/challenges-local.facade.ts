import { Injectable } from '@angular/core';

import { Challenge } from '@proto/api-interfaces';
import { BehaviorSubject } from 'rxjs';

const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Local Challenge 01',
    description: 'Local challenge description',
    comment: 'Nice work!',
    repo_url: 'enterprisey.apps',
    completed: true,
    user_id: 'user1',
  },
  {
    id: 'challenge2',
    title: 'Local Challenge 02',
    description: 'Local challenge description',
    comment: 'Hooray!',
    repo_url: 'enterprisey.apps',
    completed: true,
    user_id: 'user1',
  },
  {
    id: 'challenge3',
    title: 'Local Challenge 03',
    description: 'Local challenge description',
    comment: 'See comments',
    repo_url: 'enterprisey.apps',
    completed: false,
    user_id: 'user1',
  },
];
const mockChallenge = {
  id: null,
  title: '',
  description: '',
  comment: '',
  repo_url: '',
  completed: false,
  user_id: '',
};

@Injectable({
  providedIn: 'root'
})
export class ChallengesLocalFacade {
  private loaded = new BehaviorSubject<boolean>(false);
  private challenges = new BehaviorSubject<Challenge[]>([]);
  private selectedChallenge = new BehaviorSubject<Challenge>(mockChallenge);

  loaded$ = this.loaded.asObservable();
  allChallenges$ = this.challenges.asObservable();
  selectedChallenge$ = this.selectedChallenge.asObservable();

  resetSelectedChallenge() {
   this.selectedChallenge.next(Object.assign({}, mockChallenge));
  }

  selectChallenge(selectedId: string) {
    const challenge =
      this.challenges.value.find((challenge) => challenge.id == selectedId) ||
      Object.assign({}, mockChallenge);
    this.selectedChallenge.next(challenge);
  }

  loadChallenges() {
    this.challenges.next(mockChallenges);
  }

  loadChallenge(challengeId: string) {
    const challenge =
      this.challenges.value.find((challenge) => challenge.id == challengeId) ||
      Object.assign({}, mockChallenge);
    this.selectedChallenge.next(challenge);
  }

  saveChallenge(challenge: Challenge) {
    if (challenge.id) {
      this.updateChallenge(challenge);
    } else {
      this.createChallenge(challenge);
    }
  }

  createChallenge(challenge: Challenge) {
    this.challenges.next([...this.challenges.value, challenge]);
  }

  updateChallenge(challenge: Challenge) {
    const challenges = this.challenges.value.map((c) => {
      return c.id == challenge.id ? Object.assign({}, challenge) : challenge;
    });
    this.challenges.next(challenges);
  }

  deleteChallenge(challenge: Challenge) {
    const challenges = this.challenges.value.filter((c) => c.id == challenge.id);
    this.challenges.next(challenges);
  }
}
