import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { NotesFacade } from '@proto/notes-state';
import { mockEmptyNote, mockNote } from '@proto/testing';

import { NotesComponent } from './notes.component';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let de: DebugElement;
  let notesFacade: NotesFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotesComponent, NoopAnimationsModule],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    notesFacade = TestBed.inject(NotesFacade);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should on select call notesFacade selectNote', () => {
    const spy = jest.spyOn(notesFacade, 'selectNote');

    component.selectNote(mockNote);

    expect(spy).toHaveBeenCalledWith(mockNote.id);
  });

  describe('should on save call NotesFacade', () => {
    it('updateNote', () => {
      const spy = jest.spyOn(notesFacade, 'updateNote');

      component.saveNote(mockNote);

      expect(spy).toHaveBeenCalledWith(mockNote);
    });

    it('createNote', () => {
      const spy = jest.spyOn(notesFacade, 'createNote');

      component.saveNote(mockEmptyNote);

      expect(spy).toHaveBeenCalledWith(mockEmptyNote);
    });
  });

  it('should on delete call NotesFacade deleteNote', () => {
    const spy = jest.spyOn(notesFacade, 'deleteNote');

    component.deleteNote(mockNote);

    expect(spy).toHaveBeenCalledWith(mockNote);
  });
});
