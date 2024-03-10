import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromChallenges from './state/challenges.reducer';
import { ChallengesEffects } from './state/challenges.effects';
import { ChallengesFacade } from './state/challenges.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromChallenges.CHALLENGES_FEATURE_KEY,
      fromChallenges.challengesReducer
    ),
    EffectsModule.forFeature([ChallengesEffects]),
  ],
  providers: [ChallengesFacade],
})
export class ChallengesStateModule {}
