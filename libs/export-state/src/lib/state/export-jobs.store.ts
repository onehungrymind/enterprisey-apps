import { computed, inject } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, withHooks, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, addEntity, updateEntity, removeEntity } from '@ngrx/signals/entities';
import { firstValueFrom } from 'rxjs';
import { ExportJob } from '@proto/api-interfaces';
import { ExportJobsService } from '@proto/export-data';

type PersistedExportJob = Omit<ExportJob, 'id'> & { id: string };

export const ExportJobsStore = signalStore(
  { providedIn: 'root' },
  withEntities<PersistedExportJob>(),
  withState({
    selectedFormat: 'csv' as string,
    polling: false,
    loading: false,
    error: null as string | null,
  }),
  withComputed(({ entities }) => ({
    activeJobs: computed(() =>
      entities().filter((j) => j.status === 'queued' || j.status === 'processing')
    ),
    completedJobs: computed(() =>
      entities().filter((j) => j.status === 'completed')
    ),
    failedJobs: computed(() =>
      entities().filter((j) => j.status === 'failed')
    ),
    hasActiveJobs: computed(() =>
      entities().some((j) => j.status === 'queued' || j.status === 'processing')
    ),
  })),
  withMethods((store, jobsService = inject(ExportJobsService)) => ({
    async loadAll() {
      patchState(store, { loading: true, error: null });
      try {
        const jobs = await firstValueFrom(jobsService.all());
        patchState(store, setAllEntities(jobs as PersistedExportJob[]), { loading: false });
      } catch (err: any) {
        patchState(store, { loading: false, error: err.message });
      }
    },
    async startExport(job: ExportJob) {
      try {
        const created = await firstValueFrom(jobsService.create(job));
        patchState(store, addEntity(created as PersistedExportJob), { polling: true });
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async cancelJob(jobId: string) {
      try {
        const cancelled = await firstValueFrom(jobsService.cancel(jobId));
        const { id, ...changes } = cancelled;
        patchState(store, updateEntity({ id: id!, changes }));
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async removeJob(job: ExportJob) {
      try {
        await firstValueFrom(jobsService.delete(job));
        patchState(store, removeEntity(job.id!));
      } catch (err: any) {
        patchState(store, { error: err.message });
      }
    },
    async pollActiveJobs() {
      try {
        const active = await firstValueFrom(jobsService.getActive());
        active.forEach((job) => {
          const { id, ...changes } = job;
          patchState(store, updateEntity({ id: id!, changes }));
        });
        if (active.length === 0) {
          patchState(store, { polling: false });
        }
      } catch {
        // silently fail polling
      }
    },
    setFormat(format: string) {
      patchState(store, { selectedFormat: format });
    },
  })),
  withHooks({
    onInit(store) {
      store.loadAll();
    },
  })
);
