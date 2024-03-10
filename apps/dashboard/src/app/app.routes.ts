import { NxWelcomeComponent } from './nx-welcome.component';
import { Route } from '@angular/router';
import { loadRemoteModule } from '@nx/angular/mf';

export const appRoutes: Route[] = [
  {
    path: 'notes',
    loadChildren: () =>
      loadRemoteModule('notes', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'flashcards',
    loadChildren: () =>
      loadRemoteModule('flashcards', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'challenges',
    loadChildren: () =>
      loadRemoteModule('challenges', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'users',
    loadChildren: () =>
      loadRemoteModule('users', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: '',
    component: NxWelcomeComponent,
  },
];
