import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Widget } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class WidgetsService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  allForDashboard(dashboardId: string) {
    return this.http.get<Widget[]>(`${this.env.reportingApiUrl}/dashboards/${dashboardId}/widgets`);
  }

  find(id: string) {
    return this.http.get<Widget>(`${this.env.reportingApiUrl}/widgets/${id}`);
  }

  create(dashboardId: string, widget: Widget) {
    return this.http.post<Widget>(`${this.env.reportingApiUrl}/dashboards/${dashboardId}/widgets`, widget);
  }

  update(widget: Widget) {
    return this.http.patch<Widget>(`${this.env.reportingApiUrl}/widgets/${widget.id}`, widget);
  }

  delete(widget: Widget) {
    return this.http.delete(`${this.env.reportingApiUrl}/widgets/${widget.id}`);
  }
}
