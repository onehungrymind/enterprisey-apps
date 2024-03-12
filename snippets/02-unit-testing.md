
## Mocks

```typescript
/* eslint-disable @typescript-eslint/no-empty-function */
import { Challenge } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockChallengesFacade = {
  loadChallenges: () => {},
  selectChallenge: () => {},
  deleteChallenge: () => {},
  updateChallenge: () => {},
  createChallenge: () => {},
};

export const mockChallengesService = {
  all: () => of([]),
  find: () => of({ ...mockChallenge }),
  create: () => of({ ...mockChallenge }),
  update: () => of({ ...mockChallenge }),
  delete: () => of({ ...mockChallenge }),
};

export const mockChallenge: Challenge = {
  id: '0',
  title: 'mock',
  description: 'mock',
  completed: false,
  repo_url: 'mock',
  comment: 'mock',
  user_id: 'mock',
};

export const mockEmptyChallenge: Challenge = {
  id: null,
  title: 'mockEmpty',
  description: 'mockEmpty',
  completed: false,
  repo_url: 'mockEmpty',
  comment: 'mockEmpty',
  user_id: 'mockEmpty',
};
```

## Component Layer

```bash
➜  enterprisey git:(main) npx nx test challenges

> nx run challenges:test

 PASS   challenges  src/app/challenges/challenges-list/challenges-list.component.spec.ts (9.966 s)
 PASS   challenges  src/app/challenges/challenge-details/challenge-details.component.spec.ts (10.013 s)
 PASS   challenges  src/app/challenges/challenges.component.spec.ts (11.633 s)

Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        15.92 s
Ran all test suites.

————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 NX   Successfully ran target test for project challenges (21s)

➜  enterprisey git:(main)   
```

```typescript
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
```

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesListComponent } from './challenges-list.component';

describe('ChallengesListComponent', () => {
  let component: ChallengesListComponent;
  let fixture: ComponentFixture<ChallengesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChallengesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockChallenge } from '@proto/testing';

import { ChallengeDetailsComponent } from './challenge-details.component';

describe('ChallengeDetailsComponent', () => {
  let component: ChallengeDetailsComponent;
  let fixture: ComponentFixture<ChallengeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeDetailsComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeDetailsComponent);
    component = fixture.componentInstance;
    component.challenge = mockChallenge;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Data Layer

```bash
➜  enterprisey git:(main) npx nx test challenges-data

> nx run challenges-data:test

 PASS   challenges-data  src/lib/services/challenges.service.spec.ts
  ChallengesService
    ✓ should be created (10 ms)
    should call http.
      ✓ get() on service.all() (5 ms)
      ✓ get(url(model.id)) on service.find(model.id) (2 ms)
      ✓ post(url, model) on service.create(model) (2 ms)
      ✓ put(url(model.id), model) on service.create(model) (1 ms)
      ✓ delete(url(model.id)) on service.delete(model.id) (1 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        3.208 s
Ran all test suites.

————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 NX   Successfully ran target test for project challenges-data (5s)

➜  enterprisey git:(main) 
```


```typescript
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mockChallenge } from '@proto/testing';

import { ChallengesService } from './challenges.service';

describe('ChallengesService', () => {
  const model = 'challenges';
  let httpTestingController: HttpTestingController;
  let service: ChallengesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ChallengesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should call http.', () => {
    it('get() on service.all()', () => {
      service.all().subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush([mockChallenge]);
      httpTestingController.verify();
    });

    it('get(url(model.id)) on service.find(model.id)', () => {
      service.find(mockChallenge.id as string).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });

    it('post(url, model) on service.create(model)', () => {
      service.create(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });

      const req = httpTestingController.expectOne(service['getUrl']());
      req.flush(mockChallenge);
      httpTestingController.verify();
    });

    it('put(url(model.id), model) on service.create(model)', () => {
      service.update(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });

    it('delete(url(model.id)) on service.delete(model.id)', () => {
      service.delete(mockChallenge).subscribe((res) => {
        expect(res).toEqual(mockChallenge);
      });

      const req = httpTestingController.expectOne(
        service['getUrlWithId'](mockChallenge.id)
      );
      req.flush(mockChallenge);
      httpTestingController.verify();
    });
  });
});
```

## State Layer

```bash
➜  enterprisey git:(main) npx nx test challenges-state

> nx run challenges-state:test

 PASS   challenges-state  src/lib/state/challenges.reducer.spec.ts
 PASS   challenges-state  src/lib/state/challenges.selectors.spec.ts
 PASS   challenges-state  src/lib/state/challenges.facade.spec.ts
 PASS   challenges-state  src/lib/state/challenges.effects.spec.ts

Test Suites: 4 passed, 4 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        4.983 s
Ran all test suites.

————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

 NX   Successfully ran target test for project challenges-state (7s)

➜  enterprisey git:(main) 
```

```typescript
import { Challenge } from '@proto/api-interfaces';
import { mockChallenge } from '@proto/testing';

import {
  challengesAdapter,
  ChallengesState,
  initialChallengesState,
} from './challenges.reducer';
import * as ChallengesSelectors from './challenges.selectors';

describe('Challenges Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getChallengesId = (challenge: Challenge) => challenge['id'];
  const createChallenge = (id: string, name = '') =>
    ({ ...mockChallenge, id: id } as Challenge);

  let state: ChallengesState;

  beforeEach(() => {
    state = challengesAdapter.setAll(
      [
        createChallenge('PRODUCT-AAA'),
        createChallenge('PRODUCT-BBB'),
        createChallenge('PRODUCT-CCC'),
      ],
      {
        ...initialChallengesState,
        selectedId: 'PRODUCT-BBB',
        error: ERROR_MSG,
        loaded: true,
      }
    );
  });

  describe('Challenges Selectors', () => {
    it('getAllChallenges() should return the list of Challenges', () => {
      const results = ChallengesSelectors.getAllChallenges.projector(state);
      const selId = getChallengesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected schema', () => {
      const result = ChallengesSelectors.getSelectedChallenge.projector(
        state.entities,
        state.selectedId
      );
      const selId = getChallengesId(result as Challenge);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it("getChallengesLoaded() should return the current 'loaded' status", () => {
      const result = ChallengesSelectors.getChallengesLoaded.projector(state);

      expect(result).toBe(true);
    });

    it("getChallengesError() should return the current 'error' state", () => {
      const result = ChallengesSelectors.getChallengesError.projector(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
```

```typescript
import { Challenge } from '@proto/api-interfaces';
import { mockChallenge, mockEmptyChallenge } from '@proto/testing';

import { ChallengesActions } from './challenges.actions';
import {
  ChallengesState,
  initialChallengesState,
  reducer,
} from './challenges.reducer';

describe('Challenges Reducer', () => {
  let challenges: Challenge[];

  beforeEach(() => {
    challenges = [
      { ...mockChallenge, id: '0' },
      { ...mockChallenge, id: '1' },
      { ...mockChallenge, id: '2' },
    ];
  });

  describe('valid Challenges actions', () => {
    it('loadChallenges should set loaded to false', () => {
      const action = ChallengesActions.loadChallenges();
      const expectedState = {
        ...initialChallengesState,
        error: null,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadChallengesSuccess should set the list of known Challenges', () => {
      const action = ChallengesActions.loadChallengesSuccess({ challenges });
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: challenges[0],
          1: challenges[1],
          2: challenges[2],
        },
        ids: challenges.map((challenge) => challenge.id),
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadChallengesFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.loadChallengesFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadChallenge should set loaded to false', () => {
      const action = ChallengesActions.loadChallenge({
        challengeId: mockChallenge.id as string,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: false,
        error: null,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadChallengeSuccess should set loaded to true', () => {
      const action = ChallengesActions.loadChallengeSuccess({
        challenge: mockChallenge,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('loadChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.loadChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('updateChallengeSuccess should modify challenge', () => {
      const prepAction = ChallengesActions.loadChallengeSuccess({
        challenge: { ...mockEmptyChallenge, id: mockChallenge.id },
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );

      const expectedState = {
        ...initialChallengesState,
        loaded: true,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };

      const action = ChallengesActions.updateChallengeSuccess({
        challenge: mockChallenge,
      });
      const result: ChallengesState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('updateChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.updateChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error: error,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('createChallengeSuccess should add challenge', () => {
      const action = ChallengesActions.createChallengeSuccess({
        challenge: mockChallenge,
      });
      const expectedState = {
        ...initialChallengesState,
        loaded: false,
        entities: {
          0: mockChallenge,
        },
        ids: [mockChallenge.id],
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('createChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.createChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('deleteChallengeSuccess should add challenge', () => {
      const prepAction = ChallengesActions.loadChallengeSuccess({
        challenge: mockChallenge,
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );

      const expectedState = {
        ...initialChallengesState,
        loaded: true,
      };

      const action = ChallengesActions.deleteChallengeSuccess({
        challenge: mockChallenge,
      });
      const result: ChallengesState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('deleteChallengeFailure should set error to error', () => {
      const error = new Error();
      const action = ChallengesActions.deleteChallengeFailure({ error });
      const expectedState = {
        ...initialChallengesState,
        error,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('selectChallenge should set selectedId', () => {
      const action = ChallengesActions.selectChallenge({
        selectedId: mockChallenge.id as string,
      });
      const expectedState = {
        ...initialChallengesState,
        selectedId: mockChallenge.id,
      };

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('resetSelectedChallenge should reset selectedId', () => {
      const prepAction = ChallengesActions.selectChallenge({
        selectedId: mockChallenge.id as string,
      });
      const prepState = reducer(initialChallengesState, prepAction);

      const action = ChallengesActions.resetSelectedChallenge();
      const expectedState = {
        ...initialChallengesState,
        selectedId: null,
      };

      const result: ChallengesState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });

    it('resetChallenges should reset challenges', () => {
      const prepAction = ChallengesActions.loadChallengesSuccess({
        challenges,
      });
      const prepState: ChallengesState = reducer(
        initialChallengesState,
        prepAction
      );

      const expectedState = {
        ...initialChallengesState,
        loaded: true,
      };

      const action = ChallengesActions.resetChallenges();
      const result: ChallengesState = reducer(prepState, action);

      expect(result).toStrictEqual(expectedState);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result: ChallengesState = reducer(initialChallengesState, action);

      expect(result).toBe(initialChallengesState);
    });
  });
});
```

```typescript
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

```


```typescript
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
```