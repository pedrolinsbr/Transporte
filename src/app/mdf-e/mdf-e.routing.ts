import { Routes } from '@angular/router';

import { MdfeComponent } from './mdf-e.component';
import { MdfDownload } from './mdfDownload';

export const MdfeRoutes: Routes = [{
  path: '',
  component: MdfeComponent,
  data: {
    heading: 'MDF-e'
  }},
  {
    path: 'visualizar/:id',
    component: MdfDownload,
    data: {
      heading: 'MDF-e'
    }
}];
