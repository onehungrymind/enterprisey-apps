import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataSchema } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class SchemasService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);

  all() {
    return this.http.get<DataSchema[]>(`${this.env.ingressApiUrl}/schemas`);
  }

  find(id: string) {
    return this.http.get<DataSchema>(`${this.env.ingressApiUrl}/schemas/${id}`);
  }
}
