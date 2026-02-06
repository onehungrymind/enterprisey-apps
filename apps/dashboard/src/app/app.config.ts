import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject, isDevMode } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  Router,
  Routes,
  withViewTransitions,
} from '@angular/router';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { FeaturesEffects, FeaturesState } from '@proto/features-state';
import { APP_ENVIRONMENT, provideEnvironment } from '@proto/environment';
import { loadRemoteModule } from '@nx/angular/mf';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Feature } from '@proto/api-interfaces';
import { HomeComponent } from './home/home.component';

function initializeRoutes(): () => Promise<void> {
  const router = inject(Router);
  const http = inject(HttpClient);
  const env = inject(APP_ENVIRONMENT);

  return async () => {
    try {
      const features = await firstValueFrom(
        http.get<Feature[]>(`${env.featuresApiUrl}/features`)
      );

      const routes: Routes = [
        { path: '', component: HomeComponent },
        ...features.map((feature) => ({
          path: feature.slug,
          loadChildren: () =>
            loadRemoteModule(feature.slug, './Routes').then((m) => m.remoteRoutes),
        })),
      ];

      router.resetConfig(routes);
    } catch (error) {
      console.error('Failed to load features for routing:', error);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideHttpClient(),
    provideEnvironment(),
    provideRouter(appRoutes, withViewTransitions()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRoutes,
      multi: true,
    },
    provideEffects(),
    provideStore(
      {
        router: routerReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }
    ),
    provideRouterStore(),
    provideEffects(FeaturesEffects),
    provideState(FeaturesState.FEATURES_FEATURE_KEY, FeaturesState.reducers),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideAnimationsAsync(),
  ],
};
