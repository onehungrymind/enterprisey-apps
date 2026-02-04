import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { Dashboard } from '@proto/api-interfaces';
import { DashboardsService } from '@proto/reporting-data';

export const DashboardsStore = signalStore(
  { providedIn: 'root' },
  withEntities<Dashboard>(),
  withState({
    selectedId: null as string | null,
    loading: false,
    error: null as string | null,
  }),
  withComputed(({ entities, selectedId }) => ({
    selectedDashboard: computed(() => {
      const id = selectedId();
      return id ? entities().find((d) => d.id === id) ?? null : null;
    }),
    publicDashboards: computed(() => entities().filter((d) => d.isPublic)),
  })),
  withMethods((store, dashboardsService = inject(DashboardsService)) => ({
    async loadAll() {
      patchState(store, { loading: true, error: null });
      try {
        const dashboards = await firstValueFrom(dashboardsService.all());
        patchState(store, setAllEntities(dashboards), { loading: false });
      } catch (err: any) {
        patchState(store, { loading: false, error: err.message });
      }
    },
    select(id: string) {
      patchState(store, { selectedId: id });
    },
    resetSelection() {
      patchState(store, { selectedId: null });
    },
    async create(dashboard: Dashboard) {
      try {
        const created = await firstValueFrom(dashboardsService.create(dashboard));
        patchState(store, addEntity(created));
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async update(dashboard: Dashboard) {
      try {
        const updated = await firstValueFrom(dashboardsService.update(dashboard));
        patchState(store, updateEntity({ id: updated.id!, changes: updated }));
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async remove(dashboard: Dashboard) {
      try {
        await firstValueFrom(dashboardsService.delete(dashboard));
        patchState(store, removeEntity(dashboard.id!));
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  })
);
