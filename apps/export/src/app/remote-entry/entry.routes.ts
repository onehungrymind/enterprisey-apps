import { Route } from '@angular/router';
import { JobsComponent } from '../jobs/jobs.component';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        component: JobsComponent,
      },
    ],
  },
];
