import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature } from '@proto/api-interfaces';

// TEMPORARY
const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  model = 'features';

  constructor(private http: HttpClient) {}

  all() {
    return this.http.get<Feature[]>(this.getUrl());
  }

  find(id: string) {
    return this.http.get<Feature>(this.getUrlWithId(id));
  }

  create(feature: Feature) {
    return this.http.post(this.getUrl(), feature);
  }

  update(feature: Feature) {
    return this.http.patch(this.getUrlWithId(feature.id), feature);
  }

  delete(feature: Feature) {
    return this.http.delete(this.getUrlWithId(feature.id));
  }

  private getUrl() {
    return `${API_URL}/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/${id}`;
  }
}
