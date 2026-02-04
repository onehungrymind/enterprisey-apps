import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ExportJob } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class ExportJobsService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<ExportJob[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<ExportJob>(this.getUrlWithId(id));
  }

  getActive() {
    return this.http.get<ExportJob[]>(`${this.getUrl()}/active`);
  }

  create(job: ExportJob) {
    return this.http.post<ExportJob>(this.getUrl(), job);
  }

  cancel(id: string) {
    return this.http.post<ExportJob>(`${this.getUrlWithId(id)}/cancel`, {});
  }

  delete(job: ExportJob) {
    return this.http.delete(this.getUrlWithId(job.id));
  }

  private getUrl() {
    return `${this.env.exportApiUrl}/jobs`;
  }

  private getUrlWithId(id: string | null | undefined) {
    return `${this.getUrl()}/${id}`;
  }
}
