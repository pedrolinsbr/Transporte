//### IMPORTS
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule                     } from '@angular/router';
import { CommonModule                     } from '@angular/common';
import { JsonpModule                      } from '@angular/http';
import { NgbModule,
         NgbDatepickerI18n,
         NgbTabChangeEvent                } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule                    } from 'ng-sidebar';
import { SelectModule                     } from 'ng2-select';
import { HttpClient, HttpClientModule     } from '@angular/common/http';
import { RelatorioRoutes                  } from './relatorio.routing';
import { TextMaskModule                   } from 'angular2-text-mask';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader              } from '@ngx-translate/http-loader';
import { QRCodeModule                     } from 'angularx-qrcode';


//### TELA
import { CargaParadasComponent            } from './carga-paradas/carga-paradas.component';
import { ConhecimentoDeliveryComponent    } from './conhecimento-delivery/conhecimento-delivery.component';
import { SegurancaPremiadaComponent       } from './seguranca-premiada/seguranca-premiada.component';
import { CtrcExpedirComponent             } from './ctrc-expedir/ctrc-expedir.component';
import { AnaliseCargaComponent            } from './analise-carga/analise-carga.component';
import { DocumentoPendenteCargaComponent  } from './documento-pendente-carga/documento-pendente-carga.component';
import { LancamentoComponent              } from './lancamento/lancamento.component';
 

//### SERVICE
import { CargaParadasService              } from '../services/crud/carga-paradas.service';
import { SelectService                    } from '../services/crud/select.service';
import { GrupoTransportadoraService       } from '../shared/componentesbravo/src/app/services/crud/grupo-transportadora.service';
import { CidadeTarifaService              } from '../services/crud/cidade-tarifa.service';

//### MODULOS COMPONENTS
import { NgSelectModule                   } from '@ng-select/ng-select';
import { DragulaModule                    } from 'ng2-dragula';

//### FILTROS
import { SingleArmazemComponent           } from '../shared/componentesbravo/src/app/componentes/filter/single-armazem/single-armazem.component';
import { SingleTipoCargaComponent         } from '../shared/componentesbravo/src/app/componentes/filter/single-tipo-carga/single-tipo-carga.component';

//### COMPONENTS
import { CompBravoModule                  } from '../shared/componentesbravo/src/app/comp-bravo.module';




export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RelatorioRoutes),
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
    CargaParadasComponent,
    ConhecimentoDeliveryComponent,
    SegurancaPremiadaComponent,
    CtrcExpedirComponent,
    AnaliseCargaComponent,
    DocumentoPendenteCargaComponent,
    LancamentoComponent
  ],
  providers:[
    CargaParadasService,
    SelectService,
    GrupoTransportadoraService,
    CidadeTarifaService
  ],
  exports:[]
})

export class RelatorioModule {}
