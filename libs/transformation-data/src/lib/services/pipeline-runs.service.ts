import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PipelineRun } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class PipelineRunsService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  getRunsForPipeline(pipelineId: string) {
    return this.http.get<PipelineRun[]>(`${this.env.transformationApiUrl}/pipelines/${pipelineId}/runs`);
  }
}
