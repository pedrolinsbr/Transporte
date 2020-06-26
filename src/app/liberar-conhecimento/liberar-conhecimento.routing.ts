import { Routes } from '@angular/router';

import { LiberarConhecimentoComponent } from './liberar-conhecimento.component';

export const LiberarConhecimentoRoutes: Routes = [{
  path: '',
  component: LiberarConhecimentoComponent,
  data: {
    heading: 'Liberar Conhecimento'
  }
}];
