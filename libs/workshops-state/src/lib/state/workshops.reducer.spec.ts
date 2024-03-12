import { Action } from '@ngrx/store';

import * as WorkshopsActions from './workshops.actions';
import { WorkshopsEntity } from './workshops.models';
import {
  WorkshopsState,
  initialWorkshopsState,
  workshopsReducer,
} from './workshops.reducer';

describe('Workshops Reducer', () => {
  const createWorkshopsEntity = (id: string, name = ''): WorkshopsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Workshops actions', () => {
    it('loadWorkshopsSuccess should return the list of known Workshops', () => {
      const workshops = [
        createWorkshopsEntity('PRODUCT-AAA'),
        createWorkshopsEntity('PRODUCT-zzz'),
      ];
      const action = WorkshopsActions.loadWorkshopsSuccess({ workshops });

      const result: WorkshopsState = workshopsReducer(
        initialWorkshopsState,
        action
      );

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = workshopsReducer(initialWorkshopsState, action);

      expect(result).toBe(initialWorkshopsState);
    });
  });
});
