import { Routes } from '@angular/router';

import { MontarCargaComponent } from './montar-carga.component';

export const MontarCargaRoutes: Routes = [{
  path: '',
  component: MontarCargaComponent,
  data: {
    heading: 'MontarCarga'
  }
}];
