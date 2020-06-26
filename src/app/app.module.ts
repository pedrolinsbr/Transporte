// ###### IMPORTS
import { BrowserModule                } from '@angular/platform-browser';
import { RouterModule                 } from '@angular/router';
import { NgModule, LOCALE_ID          } from '@angular/core';
import { FormBuilder, FormGroup,
         FormControl, Validators,
         ReactiveFormsModule,
         FormsModule                  } from '@angular/forms';
import { CommonModule,
         registerLocaleData           } from '@angular/common';
import { HttpClientModule,
         HttpClient                   } from '@angular/common/http';
import { HttpModule                   } from '@angular/http';
import { ToastrModule                 } from 'ngx-toastr';
import { TranslateModule,
         TranslateLoader              } from '@ngx-translate/core';
import { TranslateHttpLoader          } from '@ngx-translate/http-loader';
import { NgbModule                    } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule                } from 'ng-sidebar';
import { CustomFormsModule            } from 'ng2-validation'
import { AppRoutes                    } from './app.routing';
import { AppComponent                 } from './app.component';
import { AdminLayoutComponent         } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent          } from './layouts/auth/auth-layout.component';
import { SharedModule                 } from './shared/shared.module';
import { TextMaskModule               } from 'angular2-text-mask';
import { BrowserAnimationsModule      } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS            } from '@angular/common/http';


// ###### SERVICES
import { AdminLayoutService           } from './services/admin-layout.service';
import { UtilServices                 } from './shared/componentesbravo/src/app/services/util.services';
import { EstadosService               } from './services/crud/estados.service';
import { GradeAgendamentoService      } from './services/crud/grade-agendamento.service';
import { DeParaService                } from './services/crud/de-para.service';
import { CtrcExpedirService           } from './services/crud/ctrc-expedir.service';
import { AnaliseCargaService           } from './services/crud/analise-carga.service';
import { DocumentoPendenteCargaService } from './services/crud/documento-pendente-carga.service';
import { ClusterService               } from './services/crud/cluster.service';
import { HistoricoService             } from './services/crud/historico.service';
import { ParametrosService            } from './services/crud/parametros.service';
import { TempoCargaService            } from './services/crud/tempo-carga.service';
import { PortariaService              } from './services/crud/portaria.service';
import { RotasService                 } from './services/crud/rotas.service';
import { ArmazemtranspService         } from './services/crud/armazem-transp.service';
import { SeguradoraService            } from './services/crud/seguradora.service';
import { NivelOcorrenciaService       } from './services/crud/nivel-ocorrencia.service';
import { JanelaService                } from './services/crud/janela.service';
import { TokenInterceptor             } from './services/token.interceptor';
import { SlotsService                 } from './services/crud/slots.service';
import { MontarCargaService           } from './services/geral/montarCarga.service';
import { CargaService                 } from './services/geral/carga.service';
import { MobileService                } from './services/geral/mobile.service';
import { MaloteService                } from './services/geral/malote.service';
import { LiberacaoService             } from './services/geral/liberacao.service';
import { AgendamentoService           } from './services/geral/agendamento.service';
import { TempoStatusService           } from './services/crud/tempo-status.service';
import { TempoArmazemService          } from './services/crud/tempo-armazem.service';
import { ConfiguracaoJanelaService    } from './services/crud/configuracao-janela.service';
import { GrupoTransportadoraService   } from './services/crud/grupo-transportadora.service';
import { SessionServices              } from './services/session.services';

import { GlobalsServices              } from './shared/componentesbravo/src/app/services/globals.services';
import { UsuarioGlobalService         } from './shared/componentesbravo/src/app/services/usuario-global.service';

import { TipoVeiculosService          } from './shared/componentesbravo/src/app/services/crud/tipo-veiculos.service';
import { FornecedorService            } from './shared/componentesbravo/src/app/services/crud/fornecedor.service';
import { TransportadorasService       } from './shared/componentesbravo/src/app/services/crud/transportadoras.service';
import { VeiculoService               } from './shared/componentesbravo/src/app/services/crud/veiculo.service';
import { MotoristaService             } from './shared/componentesbravo/src/app/services/crud/motorista.service';
import { GrupoDeClientesService       } from './shared/componentesbravo/src/app/services/crud/grupo-de-clientes.service';
import { ClientesService              } from './shared/componentesbravo/src/app/services/crud/clientes.service';
import { MunicipiosService            } from './shared/componentesbravo/src/app/services/crud/municipios.service';
import { OcorrenciaService            } from './services/crud/ocorrencia.service';
import { ParametrosGeraisCargaService } from './services/crud/parametrosGeraisCarga.service';
import { ConhecimentoService          } from './services/geral/conhecimento.service';
import { GrupoOcorrenciaService       } from './services/crud/grupo-ocorrencia.service';
import { CockpitService               } from './services/crud/cockpit.service';
import { QrcodeService                } from './services/crud/qrcode.service';
import { LogService                   } from './services/crud/log.service';
import { CargaParadasService,         } from './services/crud/carga-paradas.service';
import { TipoApontamentoService       } from './services/crud/tipo-apontamento.service';
import { PermissoesFechamentoService  } from './services/crud/permissoes-fechamento.service';
import { UsuarioApontamentoService    } from './services/crud/usuario-apontamento.service';
import { DocumentoViagemService       } from './services/crud/documentoViagem.service';
import { UpdatesService               } from './shared/componentesbravo/src/app/services/crud/updates.service';
import { HelpDeskService              } from './services/crud/help-desk.service';
import { NaturezaCargaService       } from './services/crud/natureza-carga.service';



import { CampanhaService              } from './services/crud/campanha.service';
import { LancamentoCampanhaService    } from './services/crud/lancamento-campanha.service';
import { MdfeService                  } from './services/geral/mdf-e.service';
import { SegurancaPremiadaService     } from './services/geral/seguranca-premiada.service';
import { LancamentoService            } from './services/crud/lancamento.service';



// ##### TELAS

import { RecoveryComponent            } from './account/recovery/recovery.component';
import { SignupComponent              } from './account/signup/signup.component'


// ###### CMPONENTES BRAVO
import { CompBravoModule } from './shared/componentesbravo/src/app/comp-bravo.module';

import localePt from '@angular/common/locales/pt';


registerLocaleData(localePt, 'pt-BR');


export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    RecoveryComponent,
    SignupComponent,
    //TemplateOptionsComponent
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    SharedModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    HttpClientModule,
    HttpModule,
    TextMaskModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,
    CompBravoModule
  ],

  providers: [
    HttpModule,
    FormBuilder,
    AdminLayoutService,
    GlobalsServices,
    UtilServices,
    HttpClientModule,
    EstadosService,
    GradeAgendamentoService,
    DeParaService,
    ClusterService,
    HistoricoService,
    TempoCargaService,
    PortariaService,
    VeiculoService,
    JanelaService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    ParametrosService,
    SlotsService,
    CargaService,
    MdfeService,
    SegurancaPremiadaService,
    LancamentoService,
    MobileService,
    LiberacaoService,
    MontarCargaService,
    AgendamentoService,
    TempoStatusService,
    TempoArmazemService,
    TransportadorasService,
    MotoristaService,
    ConfiguracaoJanelaService,
    GrupoTransportadoraService,
    SessionServices,
    TipoVeiculosService,
    TransportadorasService,
    UsuarioGlobalService,
    RotasService,
    ArmazemtranspService,
    SeguradoraService,
    NivelOcorrenciaService,
    FornecedorService,
    GrupoDeClientesService,
    ClientesService,
    MunicipiosService,
    OcorrenciaService,
    ParametrosGeraisCargaService,
    ConhecimentoService,
    GrupoOcorrenciaService,
    CockpitService,
    LogService,
    QrcodeService,
    CargaParadasService,
    CtrcExpedirService,
    AnaliseCargaService,
    DocumentoPendenteCargaService,
    TipoApontamentoService,
    PermissoesFechamentoService,
    UsuarioApontamentoService,
    CampanhaService,
    LancamentoCampanhaService,
    DocumentoViagemService,
    UpdatesService,
    HelpDeskService,
    MaloteService,
    NaturezaCargaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
