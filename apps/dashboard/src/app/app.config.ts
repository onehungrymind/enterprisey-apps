import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject, isDevMode } from '@angular/core';
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
import { tokenInterceptor, errorInterceptor, provideAuth, authGuard } from '@proto/auth-guard';
import { AuthFacade } from '@proto/auth-state';

function initializeAuth(): () => Promise<void> {
  const authFacade = inject(AuthFacade);

  return async () => {
    // Check if user has valid auth in localStorage
    authFacade.checkAuth();
    // Wait a tick for the check to complete
    await new Promise((resolve) => setTimeout(resolve, 50));
  };
}

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
        {
          path: 'login',
          loadComponent: () => import('./login/login.component'),
        },
        {
          path: '',
          component: HomeComponent,
          canActivate: [authGuard],
        },
        ...features.map((feature) => ({
          path: feature.slug,
          loadChildren: () =>
            loadRemoteModule(feature.slug, './Routes').then((m) => m.remoteRoutes),
          canActivate: [authGuard],
        })),
      ];

      router.resetConfig(routes);
    } catch (error) {
      console.error('Failed to load features for routing:', error);
      // Still set up basic routes even if features fail to load
      const routes: Routes = [
        {
          path: 'login',
          loadComponent: () => import('./login/login.component'),
        },
        {
          path: '',
          component: HomeComponent,
          canActivate: [authGuard],
        },
      ];
      router.resetConfig(routes);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([tokenInterceptor, errorInterceptor])
    ),
    provideEnvironment(),
    provideRouter(appRoutes, withViewTransitions()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true,
    },
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
    ...provideAuth(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    provideAnimationsAsync(),
  ],
};
