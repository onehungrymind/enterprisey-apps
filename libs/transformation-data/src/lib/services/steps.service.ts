import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TransformStep } from '@proto/api-interfaces';
import { APP_ENVIRONMENT, AppEnvironment } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class StepsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly env: AppEnvironment = inject(APP_ENVIRONMENT);

  all(pipelineId: string) {
    return this.http.get<TransformStep[]>(`${this.env.transformationApiUrl}/pipelines/${pipelineId}/steps`);
  }

  find(id: string) {
    return this.http.get<TransformStep>(`${this.env.transformationApiUrl}/steps/${id}`);
  }

  create(step: TransformStep) {
    return this.http.post<TransformStep>(`${this.env.transformationApiUrl}/steps`, step);
  }

  update(step: TransformStep) {
    return this.http.patch<TransformStep>(`${this.env.transformationApiUrl}/steps/${step.id}`, step);
  }

  delete(step: TransformStep) {
    return this.http.delete(`${this.env.transformationApiUrl}/steps/${step.id}`);
  }

  reorder(id: string, newOrder: number) {
    return this.http.patch<TransformStep>(`${this.env.transformationApiUrl}/steps/${id}/reorder`, { order: newOrder });
  }
}
