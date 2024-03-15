
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface NoteInput {
    title: string;
    content: string;
    type?: Nullable<string>;
}

export interface IQuery {
    note(id: string): Nullable<Note> | Promise<Nullable<Note>>;
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    createNote(title: string, content: string): Nullable<Note> | Promise<Nullable<Note>>;
    updateNote(id: string, title?: Nullable<string>, content?: Nullable<NoteInput>): Nullable<Note> | Promise<Nullable<Note>>;
    deleteNote(id: string): Nullable<Note> | Promise<Nullable<Note>>;
}

export interface Note {
    id: string;
    title: string;
    content: string;
}

export interface User {
    id: string;
    notes?: Nullable<Nullable<Note>[]>;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    company_id: string;
}

type Nullable<T> = T | null;
