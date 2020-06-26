import { Routes } from '@angular/router';

import { NotaComponent } from './nota.component';

export const NotaRoutes: Routes = [{
  path: '',
  component: NotaComponent,
  data: {
    heading: 'Nota'
  }
}];
