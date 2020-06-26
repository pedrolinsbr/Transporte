import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MontarCargaComponent } from './montar-carga.component';
import { MontarCargaRoutes } from './montar-carga.routing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';
import { NgbModule, NgbDatepickerI18n, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';
import { DragulaModule } from 'ng2-dragula';

import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
// import { TagInputModule } from 'ngx-chips';
// import {MaterialChipsModule} from 'angular2-material-chips';
import {FormsModule} from '@angular/forms';

import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MontarCargaRoutes),
    NgbModule.forRoot(),
    NgxChartsModule,
    CompBravoModule,
    DragulaModule,
    // TagInputModule,
    FormsModule,
    // MaterialChipsModule
    MatChipsModule,
    MatFormFieldModule,


    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  declarations: [
    MontarCargaComponent,

  ],
  providers: [

  ],
  exports:[
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule
  ]

})

export class MontarCargaModule {}
