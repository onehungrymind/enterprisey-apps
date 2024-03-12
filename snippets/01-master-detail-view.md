

## Component Layer

The container component class.

```typescript
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
```

The list component class.

```typescript
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Challenge } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-challenges-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './challenges-list.component.html',
  styleUrls: ['./challenges-list.component.scss'],
})
export class ChallengesListComponent {
  @Input() challenges: Challenge[] = [];
  @Input() readonly = false;
  @Output() selected = new EventEmitter();
  @Output() deleted = new EventEmitter();
}

```

The details component class. 

```typescript
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Challenge } from '@proto/api-interfaces';
import { MaterialModule } from '@proto/material';

@Component({
  selector: 'proto-challenge-details',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './challenge-details.component.html',
  styleUrls: ['./challenge-details.component.scss'],
})
export class ChallengeDetailsComponent {
  currentChallenge!: Challenge;
  originalTitle = '';
  @Input() set challenge(value: Challenge | null) {
    if (value) this.originalTitle = `${value.title}`;
    this.currentChallenge = Object.assign({}, value);
  }
  @Output() saved = new EventEmitter();
  @Output() cancelled = new EventEmitter();
}
```

The container component template.

```html
<div class="flex m-20">
  <div class="w-1/2 mr-10">
    <proto-challenges-list
      [challenges]="(challenges$ | async)!"
      (selected)="selectChallenge($event)"
      (deleted)="deleteChallenge($event)"></proto-challenges-list>
  </div>
  <div class="w-1/2 ml-10">
    <proto-challenge-details
      [challenge]="selectedChallenge$ | async"
      (saved)="saveChallenge($event)"
      (cancelled)="reset()"></proto-challenge-details>
  </div>
</div>
```

The list component template. 

```html
<mat-card>
  <mat-card-content>
    <mat-card-title>
      Challenges
    </mat-card-title>
    <mat-list>
      <mat-list-item *ngFor="let challenge of challenges" class="mat-list-option" (click)="selected.emit(challenge)">
        <span matLine>{{ challenge.title }}</span>
        <button *ngIf="!readonly" mat-icon-button matListItemMeta
          (click)="deleted.emit(challenge); $event.stopImmediatePropagation()"
          type="button" color="warn">
          <mat-icon>clear</mat-icon>
        </button>
      </mat-list-item>
    </mat-list>
  </mat-card-content>
</mat-card>
```

The details component template.

```html
<mat-card>
  <mat-card-content>
    <mat-card-title>
      <span *ngIf="currentChallenge.id; else elseBlock">
        Editing {{ originalTitle | titlecase }}
      </span>
      <ng-template #elseBlock> Select Challenge </ng-template>
    </mat-card-title>
    <form #form="ngForm" (ngSubmit)="saved.emit(currentChallenge)">
      <mat-form-field class="full-width">
        <input
          matInput
          placeholder="Enter a title"
          [(ngModel)]="currentChallenge.title"
          type="input"
          name="title"
          required="true" />
      </mat-form-field>
      <mat-form-field class="full-width">
        <input
          matInput
          placeholder="Enter a description"
          [(ngModel)]="currentChallenge.description"
          type="input"
          name="description" />
      </mat-form-field>
      <mat-form-field class="full-width">
        <input
          matInput
          placeholder="Enter a new password"
          [(ngModel)]="currentChallenge.repo_url"
          type="input"
          name="repo_url" />
      </mat-form-field>
      <mat-form-field class="full-width">
        <input
          matInput
          placeholder="Enter a comment"
          [(ngModel)]="currentChallenge.comment"
          type="input"
          name="comment" />
      </mat-form-field>
      <div class="full-width">
        <mat-checkbox
          [(ngModel)]="currentChallenge.completed"
          class="checkbox-margin"
          name="completed">Completed</mat-checkbox>
      </div>

      <mat-card-actions>
        <button
          [disabled]="form.invalid"
          type="submit"
          mat-button
          color="primary">
          Save
        </button>
        <button type="button" mat-button (click)="cancelled.emit()">
          Cancel
        </button>
      </mat-card-actions>
    </form>
  </mat-card-content>
</mat-card>
```

## The Data Layer

The HttpClient service.

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Challenge } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3100/api';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  model = 'challenges';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<Challenge[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Challenge>(this.getUrlWithId(id));
  }

  create(challenge: Challenge) {
    return this.http.post(this.getUrl(), challenge);
  }

  update(challenge: Challenge) {
    return this.http.patch(this.getUrlWithId(challenge.id), challenge);
  }

  delete(challenge: Challenge) {
    return this.http.delete(this.getUrlWithId(challenge.id));
  }

  private getUrl() {
    return `${API_URL}/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/${id}`;
  }
}
```

## The Full State Layer

The actions.

```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Challenge } from '@proto/api-interfaces';

export const ChallengesActions = createActionGroup({
  source: 'Challenges API',
  events: {
    'Select Challenge': props<{ selectedId: string }>(),
    'Reset Selected Challenge': emptyProps(),
    'Reset Challenges': emptyProps(),
    'Load Challenges': emptyProps(),
    'Load Challenges Success': props<{ challenges: Challenge[] }>(),
    'Load Challenges Failure': props<{ error: any }>(),
    'Load Challenge': props<{ challengeId: string }>(),
    'Load Challenge Success': props<{ challenge: Challenge }>(),
    'Load Challenge Failure': props<{ error: any }>(),
    'Create Challenge': props<{ challenge: Challenge }>(),
    'Create Challenge Success': props<{ challenge: Challenge }>(),
    'Create Challenge Failure': props<{ error: any }>(),
    'Update Challenge': props<{ challenge: Challenge }>(),
    'Update Challenge Success': props<{ challenge: Challenge }>(),
    'Update Challenge Failure': props<{ error: any }>(),
    'Delete Challenge': props<{ challenge: Challenge }>(),
    'Delete Challenge Success': props<{ challenge: Challenge }>(),
    'Delete Challenge Failure': props<{ error: any }>(),
    'Delete Challenge Cancelled': emptyProps(),
    'Upsert Challenge': props<{ challenge: Challenge }>(),
    'Upsert Challenge Success': props<{ challenge: Challenge }>(),
    'Upsert Challenge Failure': props<{ error: any }>(),
  }
});

```

The reducer.

```typescript
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Challenge } from '@proto/api-interfaces';

import { ChallengesActions } from './challenges.actions';

export interface ChallengesState extends EntityState<Challenge> {
  selectedId?: string | undefined;
  error?: string | null;
  loaded: boolean;
}

export const challengesAdapter: EntityAdapter<Challenge> =
  createEntityAdapter<Challenge>();

export const initialChallengesState: ChallengesState =
  challengesAdapter.getInitialState({
    loaded: false,
  });

const onFailure = (state: ChallengesState, { error }: any) => ({
  ...state,
  error,
});

export const reducer = createReducer(
  initialChallengesState,
  // TBD
  on(ChallengesActions.loadChallenges, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ChallengesActions.loadChallenge, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  // RESET
  on(ChallengesActions.selectChallenge, (state, { selectedId }) =>
    Object.assign({}, state, { selectedId })
  ),
  on(ChallengesActions.resetSelectedChallenge, (state) =>
    Object.assign({}, state, { selectedId: null })
  ),
  on(ChallengesActions.resetChallenges, (state) =>
    challengesAdapter.removeAll(state)
  ),
  // CRUD
  on(ChallengesActions.loadChallengesSuccess, (state, { challenges }) =>
    challengesAdapter.setAll(challenges, { ...state, loaded: true })
  ),
  on(ChallengesActions.loadChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.upsertOne(challenge, { ...state, loaded: true })
  ),
  on(ChallengesActions.createChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.addOne(challenge, state)
  ),
  on(ChallengesActions.updateChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.updateOne(
      { id: challenge.id || '', changes: challenge },
      state
    )
  ),
  on(ChallengesActions.deleteChallengeSuccess, (state, { challenge }) =>
    challengesAdapter.removeOne(challenge?.id ?? '', state)
  ),
  // FAILURE
  on(
    ChallengesActions.loadChallengesFailure,
    ChallengesActions.loadChallengeFailure,
    ChallengesActions.createChallengeFailure,
    ChallengesActions.createChallengeFailure,
    ChallengesActions.createChallengeFailure,
    ChallengesActions.updateChallengeFailure,
    ChallengesActions.deleteChallengeFailure,
    onFailure
  )
);
```

The selectors.

```typescript
import { createSelector } from '@ngrx/store';
import { getChallengesState } from './state';
import { ChallengesState, challengesAdapter } from './challenges.reducer';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = challengesAdapter.getSelectors();

const getChallengesSlice = createSelector(getChallengesState, (state) => state.challenges);

export const getChallengeIds = createSelector(getChallengesSlice, selectIds);
export const getChallengesEntities = createSelector(getChallengesSlice, selectEntities);
export const getAllChallenges = createSelector(getChallengesSlice, selectAll);
export const getChallengesTotal = createSelector(getChallengesSlice, selectTotal);
export const getSelectedChallengeId = createSelector(getChallengesSlice, (state: ChallengesState) => state.selectedId);

export const getChallengesLoaded = createSelector(
  getChallengesSlice,
  (state: ChallengesState) => state.loaded
);

export const getChallengesError = createSelector(
  getChallengesSlice,
  (state: ChallengesState) => state.error
);

export const getSelectedChallenge = createSelector(
  getChallengesEntities,
  getSelectedChallengeId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
```

The facade.

```typescript
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
```

The effects.

```typescript
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Challenge } from '@proto/api-interfaces';
import { ChallengesService } from '@proto/challenges-data';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { ChallengesActions } from './challenges.actions';

export const loadChallenges = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.loadChallenges),
      exhaustMap((action, value) =>
        challengesService.all().pipe(
          map((challenges: Challenge[]) => ChallengesActions.loadChallengesSuccess({ challenges })),
          catchError((error) => of(ChallengesActions.loadChallengesFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);

export const loadChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.loadChallenge),
      exhaustMap((action, value) => {
        return challengesService.find(action.challengeId).pipe(
          map((challenge: Challenge) => ChallengesActions.loadChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.loadChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const createChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.createChallenge),
      exhaustMap((action, value) => {
        return challengesService.create(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.createChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.createChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const updateChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.updateChallenge),
      exhaustMap((action, value) => {
        return challengesService.update(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.updateChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.updateChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const deleteChallenge = createEffect(
  (actions$ = inject(Actions), challengesService = inject(ChallengesService)) => {
    return actions$.pipe(
      ofType(ChallengesActions.deleteChallenge),
      exhaustMap((action, value) => {
        return challengesService.delete(action.challenge).pipe(
          map((challenge: any) => ChallengesActions.deleteChallengeSuccess({ challenge })),
          catchError((error) => of(ChallengesActions.deleteChallengeFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);
```

## The State Connective Tissue

```typescript
// libs/challenges-state/src/lib/state/state.ts
import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromChallenges from './challenges.reducer';

export const CHALLENGES_FEATURE_KEY = 'challenges';

export interface State {
  challenges: fromChallenges.ChallengesState;
}

export const reducers: ActionReducerMap<State> = {
  challenges: fromChallenges.reducer,
};

export const getChallengesState =
  createFeatureSelector<State>(CHALLENGES_FEATURE_KEY);
```

```typescript
// libs/challenges-state/src/index.ts
import * as ChallengesState from './lib/state/state';

export { ChallengesFacade } from './lib/state/challenges.facade';
export * as ChallengesEffects from './lib/state/challenges.effects';
export { ChallengesState };

```

```typescript
// apps/challenges/src/app/app.config.ts
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideEffects(),
    provideStore(
      {
        router: routerReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
  ],
};
```

```typescript
// apps/challenges/src/app/remote-entry/entry.routes.ts
import { Route } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { ChallengesEffects, ChallengesState } from '@proto/challenges-state';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    providers: [
      provideEffects(ChallengesEffects),
      provideState(ChallengesState.CHALLENGES_FEATURE_KEY, ChallengesState.reducers),
    ],
  },
];
```