import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flashcard } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3200/api';

@Injectable({
  providedIn: 'root',
})
export class FlashcardsService {
  model = 'flashcards';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<Flashcard[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Flashcard>(this.getUrlWithId(id));
  }

  create(flashcard: Flashcard) {
    return this.http.post(this.getUrl(), flashcard);
  }

  update(flashcard: Flashcard) {
    return this.http.patch(this.getUrlWithId(flashcard.id), flashcard);
  }

  delete(flashcard: Flashcard) {
    return this.http.delete(this.getUrlWithId(flashcard.id));
  }

  private getUrl() {
    return `/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/`;
  }
}
