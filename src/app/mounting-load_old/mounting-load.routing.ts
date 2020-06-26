import { Routes } from '@angular/router';

import { MountingLoadComponent } from './mounting-load.component';

export const MountingLoadRoutes: Routes = [{
  path: '',
  component: MountingLoadComponent,
  data: {
    heading: 'Mounting Load'
  }
}];
