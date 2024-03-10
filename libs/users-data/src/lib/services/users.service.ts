import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3400/api';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  model = 'users';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<User[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<User>(this.getUrlWithId(id));
  }

  create(user: User) {
    return this.http.post(this.getUrl(), user);
  }

  update(user: User) {
    return this.http.patch(this.getUrlWithId(user.id), user);
  }

  delete(user: User) {
    return this.http.delete(this.getUrlWithId(user.id));
  }

  private getUrl() {
    return `${API_URL}/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/${id}`;
  }
}
