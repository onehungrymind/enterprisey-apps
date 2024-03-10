import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Challenge } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';
import { ChallengesFacade } from '@proto/challenges-state';
import { Observable, filter } from 'rxjs';
import { ChallengeDetailsComponent } from './challenge-details/challenge-details.component';
import { ChallengesListComponent } from './challenges-list/challenges-list.component';

@Component({
  selector: 'proto-challenges',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ChallengesListComponent,
    ChallengeDetailsComponent,
  ],
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss'],
})
export class ChallengesComponent implements OnInit {
  challenges$: Observable<Challenge[]> = this.challengesFacade.allChallenges$;
  selectedChallenge$: Observable<Challenge> = this.challengesFacade.selectedChallenge$.pipe(
    filter((challenge): challenge is Challenge => challenge !== undefined && challenge !== '')
  );

  constructor(private challengesFacade: ChallengesFacade) {}

  ngOnInit(): void {
    this.reset();
  }

  reset() {
    this.loadChallenges();
    this.challengesFacade.resetSelectedChallenge();
  }

  selectChallenge(challenge: Challenge) {
    this.challengesFacade.selectChallenge(challenge.id as string);
  }

  loadChallenges() {
    this.challengesFacade.loadChallenges();
  }

  saveChallenge(challenge: Challenge) {
    this.challengesFacade.saveChallenge(challenge);
  }

  deleteChallenge(challenge: Challenge) {
    this.challengesFacade.deleteChallenge(challenge);
  }
}
