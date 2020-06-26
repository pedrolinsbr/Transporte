import { Routes } from '@angular/router';

import { MaloteComponent } from './malote.component';

export const MaloteRoutes: Routes = [{
  path: '',
  component: MaloteComponent,
  data: {
    heading: 'Malote'
  }
}];
