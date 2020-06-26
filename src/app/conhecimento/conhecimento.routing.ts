import { Routes } from '@angular/router';

import { ConhecimentoComponent } from './conhecimento.component';

export const ConhecimentoRoutes: Routes = [{
  path: '',
  component: ConhecimentoComponent,
  data: {
    heading: 'Conhecimento'
  }
}];
