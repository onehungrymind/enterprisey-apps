import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pipeline, SchemaField } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class PipelinesService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<Pipeline[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Pipeline>(this.getUrlWithId(id));
  }

  create(pipeline: Pipeline) {
    return this.http.post<Pipeline>(this.getUrl(), pipeline);
  }

  update(pipeline: Pipeline) {
    return this.http.patch<Pipeline>(this.getUrlWithId(pipeline.id), pipeline);
  }

  delete(pipeline: Pipeline) {
    return this.http.delete(this.getUrlWithId(pipeline.id));
  }

  run(id: string) {
    return this.http.post<any>(`${this.getUrlWithId(id)}/run`, {});
  }

  preview(id: string) {
    return this.http.get<SchemaField[]>(`${this.getUrlWithId(id)}/preview`);
  }

  getRuns(id: string) {
    return this.http.get<any[]>(`${this.getUrlWithId(id)}/runs`);
  }

  private getUrl() {
    return `${this.env.transformationApiUrl}/pipelines`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
