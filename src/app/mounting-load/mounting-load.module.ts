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
import { MountingLoadRoutes } from './mounting-load.routing';

//  ###### TELAS
import { MountingLoadComponent } from './mounting-load.component';

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
    RouterModule.forChild(MountingLoadRoutes),
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
    MountingLoadComponent,
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

export class MountingLoadModule {}
