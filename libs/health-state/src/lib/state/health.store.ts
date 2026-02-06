import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { FeatureHealth, HealthStatus } from '@proto/api-interfaces';
import { HealthService } from '@proto/health-data';

interface HealthState {
  features: FeatureHealth[];
  loading: boolean;
  lastChecked: string | null;
  error: string | null;
}

const initialState: HealthState = {
  features: [],
  loading: false,
  lastChecked: null,
  error: null,
};

let pollingSubscription: Subscription | null = null;

export const HealthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ features }) => ({
    overallStatus: computed((): HealthStatus => {
      const all = features();
      if (all.length === 0) return 'healthy';

      const hasUnhealthy = all.some(f =>
        f.api?.status === 'unhealthy' ||
        f.api?.database?.status === 'unhealthy' ||
        f.webApp?.status === 'unhealthy' ||
        f.api === null
      );
      if (hasUnhealthy) return 'unhealthy';

      const hasDegraded = all.some(f =>
        f.api?.status === 'degraded' ||
        f.api?.database?.status === 'degraded'
      );
      if (hasDegraded) return 'degraded';

      return 'healthy';
    }),
    healthGrid: computed(() => {
      const all = features();
      return all.map(f => ({
        slug: f.featureSlug,
        name: f.featureName,
        webApp: f.webApp,
        api: f.api ? {
          status: f.api.api.status,
          responseTimeMs: f.api.api.responseTimeMs,
        } : null,
        database: f.api ? {
          status: f.api.database.status,
          responseTimeMs: f.api.database.responseTimeMs,
          message: f.api.database.message,
        } : null,
      }));
    }),
    healthyCount: computed(() => {
      const all = features();
      return all.filter(f =>
        f.api?.status === 'healthy' &&
        f.api?.database?.status === 'healthy' &&
        (f.webApp === null || f.webApp?.status === 'healthy')
      ).length;
    }),
    totalCount: computed(() => features().length),
  })),
  withMethods((store, healthService = inject(HealthService)) => ({
    startPolling(intervalMs = 10000) {
      if (pollingSubscription) {
        pollingSubscription.unsubscribe();
      }
      patchState(store, { loading: true });
      pollingSubscription = healthService.pollHealth$(intervalMs).subscribe({
        next: (features) => {
          patchState(store, {
            features,
            loading: false,
            lastChecked: new Date().toISOString(),
            error: null,
          });
        },
        error: (err) => {
          patchState(store, {
            loading: false,
            error: err.message,
          });
        },
      });
    },
    stopPolling() {
      if (pollingSubscription) {
        pollingSubscription.unsubscribe();
        pollingSubscription = null;
      }
    },
    async refreshNow() {
      patchState(store, { loading: true });
      try {
        const features = await new Promise<FeatureHealth[]>((resolve, reject) => {
          healthService.checkAllHealth().subscribe({
            next: resolve,
            error: reject,
          });
        });
        patchState(store, {
          features,
          loading: false,
          lastChecked: new Date().toISOString(),
          error: null,
        });
      } catch (err: any) {
        patchState(store, {
          loading: false,
          error: err.message,
        });
      }
    },
  }))
);
