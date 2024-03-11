/* eslint-disable @typescript-eslint/no-empty-function */
import { Note, NoteTypeEnum } from '@proto/api-interfaces';
import { of } from 'rxjs';

export const mockNotesFacade = {
  loadNotes: () => {},
  selectNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
  createNote: () => {},
};

export const mockNotesService = {
  all: () => of([]),
  find: () => of({ ...mockNote }),
  create: () => of({ ...mockNote }),
  update: () => of({ ...mockNote }),
  delete: () => of({ ...mockNote }),
};

export const mockNote: Note = {
  id: '0',
  title: 'mock',
  content: 'mock',
  type: NoteTypeEnum.TEXT,
  user_id: 'mock',
};

export const mockEmptyNote: Note = {
  id: null,
  title: 'mockEmpty',
  content: 'mockEmpty',
  type: NoteTypeEnum.TEXT,
  user_id: 'mockEmpty',
};
