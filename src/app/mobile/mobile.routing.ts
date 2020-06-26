import { Routes } from '@angular/router';

import { MobileComponent } from './mobile.component';

export const MobileRoutes: Routes = [{
  path: '',
  component: MobileComponent,
  data: {
    heading: 'Mobile'
  }
}];
