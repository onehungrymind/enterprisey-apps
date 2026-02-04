import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataSource, DataSchema } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class SourcesService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<DataSource[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<DataSource>(this.getUrlWithId(id));
  }

  create(source: DataSource) {
    return this.http.post<DataSource>(this.getUrl(), source);
  }

  update(source: DataSource) {
    return this.http.patch<DataSource>(this.getUrlWithId(source.id), source);
  }

  delete(source: DataSource) {
    return this.http.delete(this.getUrlWithId(source.id));
  }

  testConnection(id: string) {
    return this.http.post<DataSource>(`${this.getUrlWithId(id)}/test-connection`, {});
  }

  sync(id: string) {
    return this.http.post<DataSource>(`${this.getUrlWithId(id)}/sync`, {});
  }

  getSchema(id: string) {
    return this.http.get<DataSchema>(`${this.getUrlWithId(id)}/schema`);
  }

  private getUrl() {
    return `${this.env.ingressApiUrl}/sources`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
