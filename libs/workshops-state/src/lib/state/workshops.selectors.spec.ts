import { WorkshopsEntity } from './workshops.models';
import {
  workshopsAdapter,
  WorkshopsPartialState,
  initialWorkshopsState,
} from './workshops.reducer';
import * as WorkshopsSelectors from './workshops.selectors';

describe('Workshops Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getWorkshopsId = (it: WorkshopsEntity) => it.id;
  const createWorkshopsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as WorkshopsEntity);

  let state: WorkshopsPartialState;

  beforeEach(() => {
    state = {
      workshops: workshopsAdapter.setAll(
        [
          createWorkshopsEntity('PRODUCT-AAA'),
          createWorkshopsEntity('PRODUCT-BBB'),
          createWorkshopsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialWorkshopsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Workshops Selectors', () => {
    it('selectAllWorkshops() should return the list of Workshops', () => {
      const results = WorkshopsSelectors.selectAllWorkshops(state);
      const selId = getWorkshopsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = WorkshopsSelectors.selectEntity(state) as WorkshopsEntity;
      const selId = getWorkshopsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectWorkshopsLoaded() should return the current "loaded" status', () => {
      const result = WorkshopsSelectors.selectWorkshopsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectWorkshopsError() should return the current "error" state', () => {
      const result = WorkshopsSelectors.selectWorkshopsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
