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
import { AdministrativoRoutes                  } from './administrativo.routing';
import { TextMaskModule                   } from 'angular2-text-mask';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader              } from '@ngx-translate/http-loader';
import { QRCodeModule                     } from 'angularx-qrcode';

//### TELA

/* import { TelaLogComponent             } from './tela-log/tela-log.component';
import { TelaLogAplicacaoComponent    } from './tela-log-aplicacao/tela-log-aplicacao.component'; */

//Comentando linhas pois telas foram movidas para outro modulo (Suporte)

//### SERVICE
import { SelectService                    } from '../services/crud/select.service';
import { GrupoTransportadoraService       } from '../shared/componentesbravo/src/app/services/crud/grupo-transportadora.service';
import { CidadeTarifaService } from '../services/crud/cidade-tarifa.service';
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
    RouterModule.forChild(AdministrativoRoutes),
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
   
    /* TelaLogComponent,
    TelaLogAplicacaoComponent */

    //Comentando linhas pois telas foram movidas para outro modulo 
  
  ],
  providers:[
    SelectService,
    GrupoTransportadoraService,
    CidadeTarifaService
  ],
  exports:[]
})

export class AdministrativoModule {}
