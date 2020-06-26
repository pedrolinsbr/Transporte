import { Routes } from '@angular/router';

import { LiberacaoComponent } from './liberacao.component';

export const LiberacaoRoutes: Routes = [{
  path: '',
  component: LiberacaoComponent,
  data: {
    heading: 'Liberação'
  }
}];
