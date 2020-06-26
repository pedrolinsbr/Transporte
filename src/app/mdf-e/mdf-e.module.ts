//  ###### COMPONENTES
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgbModule, NgbDatepickerI18n, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

//  ##### ROUTES
import { MdfeRoutes } from './mdf-e.routing';

//  ###### TELAS
import { MdfeComponent } from './mdf-e.component';
import { MdfDownload   } from './mdfDownload';
//  ###### COMPONENTES BRAVO
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';


import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MdfeRoutes),
    NgbModule.forRoot(),
    NgxChartsModule,
    CompBravoModule,
    DragulaModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,

    // CHIPAO
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  declarations: [
    MdfeComponent,
    MdfDownload
  ],
  providers: [

  ],
  exports:[
    // CHIPAO
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule
  ]

})

export class MdfeModule {}
