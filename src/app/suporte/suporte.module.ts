//### IMPORTS
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JsonpModule } from '@angular/http';
import {
  NgbModule,
  NgbDatepickerI18n,
  NgbTabChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';
import { SelectModule } from 'ng2-select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SuporteRoutes } from './suporte.routing';
import { TextMaskModule } from 'angular2-text-mask';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRCodeModule } from 'angularx-qrcode';

//### TELA



//### SERVICE
import { SelectService } from '../services/crud/select.service';
import { GrupoTransportadoraService } from '../shared/componentesbravo/src/app/services/crud/grupo-transportadora.service';
import { CidadeTarifaService } from '../services/crud/cidade-tarifa.service';
//### MODULOS COMPONENTS
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';

//### FILTROS
import { SingleArmazemComponent } from '../shared/componentesbravo/src/app/componentes/filter/single-armazem/single-armazem.component';
import { SingleTipoCargaComponent } from '../shared/componentesbravo/src/app/componentes/filter/single-tipo-carga/single-tipo-carga.component';

//### COMPONENTS
import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';
import { HelpDeskMdfComponent } from './help-desk-mdf/help-desk-mdf.component';
import { HelpDeskCteComponent } from './help-desk-cte/help-desk-cte.component';
import { HelpDeskSlaDeliveryComponent } from './help-desk-sla-delivery/help-desk-sla-delivery.component';
import { HelpDeskAverbacaoComponent } from './help-desk-averbacao/help-desk-averbacao.component';
import { TelaLogComponent             } from './tela-log/tela-log.component';
import { TelaLogAplicacaoComponent    } from './tela-log-aplicacao/tela-log-aplicacao.component';




export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT + '/locales/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SuporteRoutes),
    JsonpModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    NgSelectModule,
    DragulaModule,
    QRCodeModule,
    CompBravoModule
  ],
  declarations: [
    HelpDeskMdfComponent,
    HelpDeskCteComponent,
    HelpDeskSlaDeliveryComponent,
    HelpDeskAverbacaoComponent,
    TelaLogComponent,
    TelaLogAplicacaoComponent
  ],
  providers: [
    SelectService,
    GrupoTransportadoraService,
    CidadeTarifaService
  ],
  exports: []
})

export class SuporteModule { }
