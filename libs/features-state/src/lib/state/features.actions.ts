import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Feature } from '@proto/api-interfaces';

export const FeaturesActions = createActionGroup({
  source: 'Features API',
  events: {
    'Select Feature': props<{ selectedId: string }>(),
    'Reset Selected Feature': emptyProps(),
    'Reset Features': emptyProps(),
    'Load Features': emptyProps(),
    'Load Features Success': props<{ features: Feature[] }>(),
    'Load Features Failure': props<{ error: any }>(),
    'Load Feature': props<{ featureId: string }>(),
    'Load Feature Success': props<{ feature: Feature }>(),
    'Load Feature Failure': props<{ error: any }>(),
    'Create Feature': props<{ feature: Feature }>(),
    'Create Feature Success': props<{ feature: Feature }>(),
    'Create Feature Failure': props<{ error: any }>(),
    'Update Feature': props<{ feature: Feature }>(),
    'Update Feature Success': props<{ feature: Feature }>(),
    'Update Feature Failure': props<{ error: any }>(),
    'Delete Feature': props<{ feature: Feature }>(),
    'Delete Feature Success': props<{ feature: Feature }>(),
    'Delete Feature Failure': props<{ error: any }>(),
    'Delete Feature Cancelled': emptyProps(),
    'Upsert Feature': props<{ feature: Feature }>(),
    'Upsert Feature Success': props<{ feature: Feature }>(),
    'Upsert Feature Failure': props<{ error: any }>(),
  },
});
