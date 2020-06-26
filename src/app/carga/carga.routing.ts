import { Routes } from '@angular/router';

import { CargaComponent } from './carga.component';

export const CargaRoutes: Routes = [{
  path: '',
  component: CargaComponent,
  data: {
    heading: 'Carga'
  }
}];
