import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Company } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<Company[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Company>(this.getUrlWithId(id));
  }

  create(company: Company) {
    return this.http.post<Company>(this.getUrl(), company);
  }

  update(company: Company) {
    return this.http.patch<Company>(this.getUrlWithId(company.id), company);
  }

  delete(company: Company) {
    return this.http.delete(this.getUrlWithId(company.id));
  }

  private getUrl() {
    return `${this.env.usersApiUrl}/companies`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
