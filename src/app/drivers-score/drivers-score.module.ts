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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';


//  ##### ROUTES
import { DriversScoreRoutes } from './drivers-score.routing';

//  ###### TELAS
import { DriversScoreComponent } from './drivers-score.component';

import { TipoApontamentoComponent } from './shared/tipo-apontamento/tipo-apontamento.component';
import { CampanhaComponent } from './shared/campanha/campanha.component';
import { LancamentoCampanhaComponent } from './shared/lancamento-campanha/lancamento-campanha.component';
import { UsuarioApontamentoComponent } from './shared/usuario-apontamento/usuario-apontamento.component';
import { LancamentoCampanhaMassaComponent } from './shared/lancamento-campanha-massa/lancamento-campanha-massa.component';
import { PermissoesFechamentoComponent } from './shared/permissoes-fechamento/permissoes-fechamento.component';
//  ###### COMPONENTES BRAVO
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule} from '@angular/common/http';

import { FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule                   } from '@ng-select/ng-select';

export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}


import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DriversScoreRoutes),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxChartsModule,
    CompBravoModule,
    DragulaModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    QRCodeModule,

    // CHIPAO
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    FileUploadModule,
    NgSelectModule
  ],
  declarations: [
    DriversScoreComponent,
    TipoApontamentoComponent,
    UsuarioApontamentoComponent,
    CampanhaComponent,
    LancamentoCampanhaComponent,
    LancamentoCampanhaMassaComponent,
    PermissoesFechamentoComponent
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

export class DriversScoreModule {}
