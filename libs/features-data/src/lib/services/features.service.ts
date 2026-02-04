import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Feature } from '@proto/api-interfaces';
import { APP_ENVIRONMENT } from '@proto/environment';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private http = inject(HttpClient);
  private env = inject(APP_ENVIRONMENT);
  model = 'features';

  constructor() {}

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
    return `${this.env.featuresApiUrl}/${this.model}`;
  }

  private getUrlWithId(id: string | undefined | null) {
    return `${this.getUrl()}/${id}`;
  }
}
