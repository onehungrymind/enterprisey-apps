import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config.server';
import { RemoteEntryComponent } from './app/remote-entry/entry.component';

const bootstrap = () => bootstrapApplication(RemoteEntryComponent, appConfig);
export default bootstrap;
