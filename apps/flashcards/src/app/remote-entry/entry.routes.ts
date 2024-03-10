import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { FlashcardsEffects, FlashcardsState } from '@proto/flashcards-state';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(FlashcardsEffects),
      provideState(FlashcardsState.FLASHCARDS_FEATURE_KEY, FlashcardsState.reducers),
    ],
  },
];
