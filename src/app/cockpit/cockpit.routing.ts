import { Routes } from '@angular/router';

import { CockpitComponent } from './cockpit.component';

export const CockpitRoutes: Routes = [{
  path: '',
  component: CockpitComponent,
  data: {
    heading: 'Cockpit'
  }
}];
