import { Routes } from '@angular/router';

import { DriversScoreComponent } from './drivers-score.component';

export const DriversScoreRoutes: Routes = [{
  path: '',
  component: DriversScoreComponent,
  data: {
    heading: 'Segurança PREMIADA'
  }
}];
