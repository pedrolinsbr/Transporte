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
import { CadastrosRoutes                  } from './cadastros.routing';
import { TextMaskModule                   } from 'angular2-text-mask';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader              } from '@ngx-translate/http-loader';
import { QRCodeModule                     } from 'angularx-qrcode';

//### TELA
import { TelaVeiculoComponent             } from './tela-veiculo/tela-veiculo.component';
import { TelaTipoVeiculoComponent         } from './tela-tipo-veiculo/tela-tipo-veiculo.component';
import { TelaTransportadoraComponent      } from './tela-transportadora/tela-transportadora.component';
import { TelaGrupoTransportadoraComponent } from './tela-grupo-transportadora/tela-grupo-transportadora.component';
import { TelaMotoristaComponent           } from './tela-motorista/tela-motorista.component';
import { DeParaComponent                  } from './de-para/de-para.component';
import { RotasComponent                   } from './rotas/rotas.component';
import { ArmazemTranspComponent           } from './armazem-transp/armazem-transp.component';
import { HistoricoComponent               } from './historico/historico.component';
import { SeguradoraComponent              } from './seguradora/seguradora.component';
import { NivelOcorrenciaComponent         } from './nivel-ocorrencia/nivel-ocorrencia.component';
import { TelaFornecedorComponent          } from './tela-fornecedor/tela-fornecedor.component';
import { TelaClienteComponent             } from './tela-cliente/tela-cliente.component';
import { OcorrenciaComponent              } from './ocorrencia/ocorrencia.component';
import { ParametrosGeraisCargaComponent   } from './parametros-gerais-carga/parametros-gerais-carga.component';
import { GrupoOcorrenciaComponent         } from './grupo-ocorrencia/grupo-ocorrencia.component';
import { QrcodeComponent                  } from './qrcode/qrcode.component';
import { ClusterComponent                 } from './cluster/cluster.component';
import { CidadeTarifaComponent            } from './cidade-tarifa/cidade-tarifa.component';
import { DocumentoViagemComponent         } from './documento-viagem/documento-viagem.component';
import { TelaUpdatesComponent             } from './tela-updates/tela-updates.component';
import { HorarioCorteComponent            } from './horario-corte/horario-corte.component';
import { NaturezaCargaComponent            } from './natureza-carga/natureza-carga.component';



//### SERVICE
import { SelectService                    } from '../services/crud/select.service';
import { GrupoTransportadoraService       } from '../shared/componentesbravo/src/app/services/crud/grupo-transportadora.service';
import { CidadeTarifaService              } from '../services/crud/cidade-tarifa.service';
import { HorarioCorteService              } from '../services/crud/horario-corte.service';
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
    RouterModule.forChild(CadastrosRoutes),
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
    DeParaComponent,
    TelaVeiculoComponent,
    ClusterComponent,
    TelaTipoVeiculoComponent,
    TelaFornecedorComponent,
    TelaTransportadoraComponent,
    TelaGrupoTransportadoraComponent,
    TelaMotoristaComponent,
    RotasComponent,
    ArmazemTranspComponent,
    HistoricoComponent,
    SeguradoraComponent,
    NivelOcorrenciaComponent,
    TelaClienteComponent,
    OcorrenciaComponent,
    ParametrosGeraisCargaComponent,
    GrupoOcorrenciaComponent,
    QrcodeComponent,
    CidadeTarifaComponent,
    DocumentoViagemComponent,
    TelaUpdatesComponent,
    HorarioCorteComponent,
    NaturezaCargaComponent
  ],
  providers:[
    SelectService,
    GrupoTransportadoraService,
    CidadeTarifaService,
    HorarioCorteService
  ],
  exports:[]
})

export class CadastrosModule {}
