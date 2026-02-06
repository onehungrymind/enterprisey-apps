import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';
import { Feature } from '@proto/api-interfaces';
import { FeaturesFacade } from '@proto/features-state';
import { Observable, tap } from 'rxjs';
import { HomeComponent } from './home/home.component';

@Component({
    imports: [RouterModule, AsyncPipe],
    selector: 'proto-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  features$: Observable<Feature[]> = this.featuresFacade.allFeatures$.pipe(
    tap((features: Feature[]) => this.configRoutes(features))
  );

  constructor(private featuresFacade: FeaturesFacade, private router: Router) {}

  ngOnInit() {
    this.featuresFacade.loadFeatures();
  }

  configRoutes(features: Feature[]) {
    const home: Route = {
      path: '',
      component: HomeComponent,
    };

    const routes = features.reduce((acc: any, cur: any) => {
      acc = [
        ...acc,
        {
          path: cur.slug,
          loadChildren: () =>
            loadRemoteModule(cur.slug, './Routes').then((m) => m.remoteRoutes),
        },
      ];
      return acc;
    }, [home]);

    this.router.resetConfig(routes);
  }
}
