import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Workshop } from '@proto/api-interfaces';

export const WorkshopsActions = createActionGroup({
  source: 'Workshops API',
  events: {
    'Select Workshop': props<{ selectedId: string }>(),
    'Reset Selected Workshop': emptyProps(),
    'Reset Workshops': emptyProps(),
    'Load Workshops': emptyProps(),
    'Load Workshops Success': props<{ workshops: Workshop[] }>(),
    'Load Workshops Failure': props<{ error: any }>(),
    'Load Workshop': props<{ workshopId: string }>(),
    'Load Workshop Success': props<{ workshop: Workshop }>(),
    'Load Workshop Failure': props<{ error: any }>(),
    'Create Workshop': props<{ workshop: Workshop }>(),
    'Create Workshop Success': props<{ workshop: Workshop }>(),
    'Create Workshop Failure': props<{ error: any }>(),
    'Update Workshop': props<{ workshop: Workshop }>(),
    'Update Workshop Success': props<{ workshop: Workshop }>(),
    'Update Workshop Failure': props<{ error: any }>(),
    'Delete Workshop': props<{ workshop: Workshop }>(),
    'Delete Workshop Success': props<{ workshop: Workshop }>(),
    'Delete Workshop Failure': props<{ error: any }>(),
    'Delete Workshop Cancelled': emptyProps(),
    'Upsert Workshop': props<{ workshop: Workshop }>(),
    'Upsert Workshop Success': props<{ workshop: Workshop }>(),
    'Upsert Workshop Failure': props<{ error: any }>(),
  }
});
