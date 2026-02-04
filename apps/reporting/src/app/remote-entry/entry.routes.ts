import { Route } from '@angular/router';
import { DashboardsComponent } from '../dashboards/dashboards.component';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        component: DashboardsComponent,
      },
    ],
  },
];
