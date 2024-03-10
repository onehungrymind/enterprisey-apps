import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3300/api';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  model = 'notes';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<Note[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Note>(this.getUrlWithId(id));
  }

  create(note: Note) {
    return this.http.post(this.getUrl(), note);
  }

  update(note: Note) {
    return this.http.patch(this.getUrlWithId(note.id), note);
  }

  delete(note: Note) {
    return this.http.delete(this.getUrlWithId(note.id));
  }

  private getUrl() {
    return `/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/`;
  }
}
