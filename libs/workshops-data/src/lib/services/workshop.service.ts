import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Workshop } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3300/api';

@Injectable({
  providedIn: 'root',
})
export class WorkshopsService {
  model = 'workshops';

  constructor(private http: HttpClient) {}

  all() {
    console.log('HELLO NOTES!', this.getUrl())
    return this.http.get<Workshop[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Workshop>(this.getUrlWithId(id));
  }

  create(workshop: Workshop) {
    return this.http.post(this.getUrl(), workshop);
  }

  update(workshop: Workshop) {
    return this.http.patch(this.getUrlWithId(workshop.id), workshop);
  }

  delete(workshop: Workshop) {
    return this.http.delete(this.getUrlWithId(workshop.id));
  }

  private getUrl() {
    return `/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/${id}`;
  }
}
