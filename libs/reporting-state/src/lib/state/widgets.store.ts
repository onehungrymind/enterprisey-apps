import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { Widget, QueryResult } from '@proto/api-interfaces';
import { WidgetsService, QueriesService } from '@proto/reporting-data';

type PersistedWidget = Omit<Widget, 'id'> & { id: string };

interface WidgetData {
  widgetId: string;
  queryResult: QueryResult | null;
  loading: boolean;
  error: string | null;
}

export const WidgetsStore = signalStore(
  { providedIn: 'root' },
  withEntities<PersistedWidget>(),
  withState({
    currentDashboardId: null as string | null,
    loading: false,
    error: null as string | null,
    widgetData: {} as Record<string, WidgetData>,
  }),
  withComputed(({ entities, currentDashboardId, widgetData }) => ({
    currentWidgets: computed(() => {
      const dashboardId = currentDashboardId();
      if (!dashboardId) return [];
      return entities().filter((w) => w.dashboardId === dashboardId);
    }),
    getWidgetData: computed(() => (widgetId: string) => {
      return widgetData()[widgetId] ?? { widgetId, queryResult: null, loading: false, error: null };
    }),
    // Get widget count for a specific dashboard
    getWidgetCount: computed(() => (dashboardId: string) => {
      return entities().filter((w) => w.dashboardId === dashboardId).length;
    }),
    // Get all dashboard IDs that have widgets loaded
    loadedDashboardIds: computed(() => {
      const ids = new Set(entities().map((w) => w.dashboardId));
      return Array.from(ids);
    }),
  })),
  withMethods((store, widgetsService = inject(WidgetsService), queriesService = inject(QueriesService)) => ({
    async loadForDashboard(dashboardId: string) {
      patchState(store, { loading: true, error: null, currentDashboardId: dashboardId });
      try {
        const widgets = await firstValueFrom(widgetsService.allForDashboard(dashboardId));
        // Clear existing widgets for this dashboard and set new ones
        const currentWidgets = store.entities().filter((w) => w.dashboardId !== dashboardId);
        patchState(store, setAllEntities([...currentWidgets, ...widgets] as PersistedWidget[]), { loading: false });
      } catch (err: any) {
        patchState(store, { loading: false, error: err.message });
      }
    },

    async executeWidgetQuery(widgetId: string, queryId: string) {
      // Mark widget as loading
      const currentData = store.widgetData();
      patchState(store, {
        widgetData: {
          ...currentData,
          [widgetId]: { widgetId, queryResult: null, loading: true, error: null },
        },
      });

      try {
        const queryResult = await firstValueFrom(queriesService.execute(queryId));
        const updatedData = store.widgetData();
        patchState(store, {
          widgetData: {
            ...updatedData,
            [widgetId]: { widgetId, queryResult, loading: false, error: null },
          },
        });
      } catch (err: any) {
        const updatedData = store.widgetData();
        patchState(store, {
          widgetData: {
            ...updatedData,
            [widgetId]: { widgetId, queryResult: null, loading: false, error: err.message },
          },
        });
      }
    },

    async executeAllWidgetQueries() {
      const widgets = store.currentWidgets();
      for (const widget of widgets) {
        if (widget.queryId) {
          // Don't await - execute in parallel
          this.executeWidgetQuery(widget.id, widget.queryId);
        }
      }
    },

    clearWidgetData() {
      patchState(store, { widgetData: {} });
    },

    async create(dashboardId: string, widget: Widget) {
      try {
        const created = await firstValueFrom(widgetsService.create(dashboardId, widget));
        patchState(store, addEntity(created as PersistedWidget));
        return created;
      } catch (err: any) {
        patchState(store, { error: err.message });
        return null;
      }
    },

    async update(widget: Widget) {
      try {
        const updated = await firstValueFrom(widgetsService.update(widget));
        const { id, ...changes } = updated;
        patchState(store, updateEntity({ id: id!, changes }));
        return updated;
      } catch (err: any) {
        patchState(store, { error: err.message });
        return null;
      }
    },

    async remove(widget: Widget) {
      try {
        await firstValueFrom(widgetsService.delete(widget));
        patchState(store, removeEntity(widget.id!));
        // Also clear widget data
        const currentData = store.widgetData();
        const { [widget.id!]: _, ...rest } = currentData;
        patchState(store, { widgetData: rest });
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
  }))
);
