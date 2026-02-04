import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ReportQuery, QueryResult } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class QueriesService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<ReportQuery[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<ReportQuery>(this.getUrlWithId(id));
  }

  create(query: ReportQuery) {
    return this.http.post<ReportQuery>(this.getUrl(), query);
  }

  update(query: ReportQuery) {
    return this.http.patch<ReportQuery>(this.getUrlWithId(query.id), query);
  }

  delete(query: ReportQuery) {
    return this.http.delete(this.getUrlWithId(query.id));
  }

  execute(id: string) {
    return this.http.get<QueryResult>(this.getUrlWithId(id) + '/execute');
  }

  private getUrl() {
    return `${this.env.reportingApiUrl}/queries`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
