
import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { NotesEffects, NotesState } from '@proto/notes-state';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(NotesEffects),
      provideState(NotesState.NOTES_FEATURE_KEY, NotesState.reducers),
    ],
  },
];
