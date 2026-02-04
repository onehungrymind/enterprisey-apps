import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);
  model = 'users';

  constructor() {}

  login(email: string, password: string) {
    return this.http.post<User>(this.getLoginUrl(), { email, password });
  }

  findByEmail(email: string) {
    return this.http.get<User>(this.getUrlWithEmail(email));
  }

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
    return `${this.env.usersApiUrl}/${this.model}`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }

  private getLoginUrl() {
    return `${this.env.usersApiUrl}/auth/login`;
  }

  private getUrlWithEmail(email: string) {
    return `${this.getUrl()}/email/${email}`;
  }
}
