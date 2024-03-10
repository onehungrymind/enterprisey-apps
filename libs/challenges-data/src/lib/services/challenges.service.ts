import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Challenge } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3100/api';

@Injectable({
  providedIn: 'root',
})
export class ChallengesService {
  model = 'challenges';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<Challenge[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Challenge>(this.getUrlWithId(id));
  }

  create(challenge: Challenge) {
    return this.http.post(this.getUrl(), challenge);
  }

  update(challenge: Challenge) {
    return this.http.patch(this.getUrlWithId(challenge.id), challenge);
  }

  delete(challenge: Challenge) {
    return this.http.delete(this.getUrlWithId(challenge.id));
  }

  private getUrl() {
    return `/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/`;
  }
}
