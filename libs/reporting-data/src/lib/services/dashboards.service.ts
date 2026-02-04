import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Dashboard } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardsService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<Dashboard[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Dashboard>(this.getUrlWithId(id));
  }

  create(dashboard: Dashboard) {
    return this.http.post<Dashboard>(this.getUrl(), dashboard);
  }

  update(dashboard: Dashboard) {
    return this.http.patch<Dashboard>(this.getUrlWithId(dashboard.id), dashboard);
  }

  delete(dashboard: Dashboard) {
    return this.http.delete(this.getUrlWithId(dashboard.id));
  }

  private getUrl() {
    return `${this.env.reportingApiUrl}/dashboards`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
