import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiHealthResponse, FeatureHealth, HealthStatus } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';
import { Observable, timer, forkJoin, of, map, catchError, switchMap } from 'rxjs';

interface FeatureConfig {
  slug: string;
  name: string;
  apiUrl: string;
  webAppUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);
  private readonly timeout = 5000;

  private readonly features: FeatureConfig[] = [
    { slug: 'ingress', name: 'Ingress', apiUrl: this.env.ingressApiUrl, webAppUrl: 'http://localhost:4202' },
    { slug: 'transformation', name: 'Transformation', apiUrl: this.env.transformationApiUrl, webAppUrl: 'http://localhost:4203' },
    { slug: 'reporting', name: 'Reporting', apiUrl: this.env.reportingApiUrl, webAppUrl: 'http://localhost:4204' },
    { slug: 'export', name: 'Export', apiUrl: this.env.exportApiUrl, webAppUrl: 'http://localhost:4205' },
    { slug: 'users', name: 'Users', apiUrl: this.env.usersApiUrl, webAppUrl: 'http://localhost:4201' },
  ];

  checkApiHealth(apiUrl: string): Observable<ApiHealthResponse | null> {
    const start = Date.now();
    return this.http.get<ApiHealthResponse>(`${apiUrl}/health`).pipe(
      map(response => ({
        ...response,
        api: {
          ...response.api,
          responseTimeMs: Date.now() - start,
        },
      })),
      catchError(() => of(null))
    );
  }

  checkWebAppHealth(webAppUrl: string): Observable<{ status: HealthStatus; responseTimeMs: number } | null> {
    const start = Date.now();
    return this.http.get(webAppUrl, { responseType: 'text' }).pipe(
      map(() => ({
        status: 'healthy' as HealthStatus,
        responseTimeMs: Date.now() - start,
      })),
      catchError(() => of({
        status: 'unhealthy' as HealthStatus,
        responseTimeMs: Date.now() - start,
      }))
    );
  }

  checkFeatureHealth(feature: FeatureConfig): Observable<FeatureHealth> {
    const webAppCheck$ = feature.webAppUrl
      ? this.checkWebAppHealth(feature.webAppUrl)
      : of(null);

    const apiCheck$ = this.checkApiHealth(feature.apiUrl);

    return forkJoin({
      webApp: webAppCheck$,
      api: apiCheck$,
    }).pipe(
      map(({ webApp, api }) => ({
        featureSlug: feature.slug,
        featureName: feature.name,
        webApp,
        api,
        lastChecked: new Date().toISOString(),
      }))
    );
  }

  checkAllHealth(): Observable<FeatureHealth[]> {
    return forkJoin(
      this.features.map(feature => this.checkFeatureHealth(feature))
    );
  }

  pollHealth$(intervalMs = 10000): Observable<FeatureHealth[]> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.checkAllHealth())
    );
  }

  getFeatures(): FeatureConfig[] {
    return this.features;
  }
}
