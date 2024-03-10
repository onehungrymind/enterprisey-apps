import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Note } from '@proto/api-interfaces';

export const NotesActions = createActionGroup({
  source: 'Notes API',
  events: {
    'Select Note': props<{ selectedId: string }>(),
    'Reset Selected Note': emptyProps(),
    'Reset Notes': emptyProps(),
    'Load Notes': emptyProps(),
    'Load Notes Success': props<{ notes: Note[] }>(),
    'Load Notes Failure': props<{ error: any }>(),
    'Load Note': props<{ noteId: string }>(),
    'Load Note Success': props<{ note: Note }>(),
    'Load Note Failure': props<{ error: any }>(),
    'Create Note': props<{ note: Note }>(),
    'Create Note Success': props<{ note: Note }>(),
    'Create Note Failure': props<{ error: any }>(),
    'Update Note': props<{ note: Note }>(),
    'Update Note Success': props<{ note: Note }>(),
    'Update Note Failure': props<{ error: any }>(),
    'Delete Note': props<{ note: Note }>(),
    'Delete Note Success': props<{ note: Note }>(),
    'Delete Note Failure': props<{ error: any }>(),
    'Delete Note Cancelled': emptyProps(),
    'Upsert Note': props<{ note: Note }>(),
    'Upsert Note Success': props<{ note: Note }>(),
    'Upsert Note Failure': props<{ error: any }>(),
  }
});
