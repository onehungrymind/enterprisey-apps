import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PipelineRun } from '@proto/api-interfaces';
import { APP_ENVIRONMENT, AppEnvironment } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class PipelineRunsService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly env: AppEnvironment = inject(APP_ENVIRONMENT);

  getRunsForPipeline(pipelineId: string) {
    return this.http.get<PipelineRun[]>(`${this.env.transformationApiUrl}/pipelines/${pipelineId}/runs`);
  }

  getRun(runId: string) {
    return this.http.get<PipelineRun>(`${this.env.transformationApiUrl}/runs/${runId}`);
  }
}
