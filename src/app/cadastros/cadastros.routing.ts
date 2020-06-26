import { Routes                           } from '@angular/router';
import { DeParaComponent                  } from './de-para/de-para.component';

// #### TELAS
import { TelaMotoristaComponent           } from './tela-motorista/tela-motorista.component';
import { TelaVeiculoComponent             } from './tela-veiculo/tela-veiculo.component';
import { TelaGrupoTransportadoraComponent } from './tela-grupo-transportadora/tela-grupo-transportadora.component';
import { TelaTransportadoraComponent      } from './tela-transportadora/tela-transportadora.component';
import { TelaTipoVeiculoComponent         } from './tela-tipo-veiculo/tela-tipo-veiculo.component';
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



export const CadastrosRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'dePara',
                component: DeParaComponent,
                data: {
                    heading: 'De para'
                },
            }, {
                path: 'cluster',
                component: ClusterComponent,
                data: {
                    heading: 'Cluster'
                },
            },{
                path: 'armazemTransp',
                component: ArmazemTranspComponent,
                data: {
                    heading: 'Armazem/Transportadora'
                },
            }, {
                path: 'motorista',
                component: TelaMotoristaComponent,
                data: {
                    heading: 'Motorista'
                },
            }, {
                path: 'veiculos',
                component: TelaVeiculoComponent,
                data: {
                    heading: 'Veículo'
                },
            }, {
                path: 'transportadora',
                component: TelaTransportadoraComponent,
                data: {
                    heading: 'Transportadora'
                },
            }, {
                path: 'grupoTransportadora',
                component: TelaGrupoTransportadoraComponent,
                data: {
                    heading: 'Grupo Transportadora'
                },
            }, {
                path: 'tipoVeiculos',
                component: TelaTipoVeiculoComponent,
                data: {
                    heading: 'Tipo veículos'
                },
            }, {
                path: 'rotas',
                component: RotasComponent,
                data: {
                    heading: 'Rotas'
                },
             }, {
                 path: 'apolice',
                 component: SeguradoraComponent,
                 data: {
                     heading: 'Seguradora'
                 },
            }, {
                path: 'historicoOcorrencia',
                component: HistoricoComponent,
                data: {
                    heading: 'Histórico'
                },
            }, {
                path: 'niveisOcorrencia',
                component: NivelOcorrenciaComponent,
                data: {
                    heading: 'Nível Ocorrência'
                },
            }, {
                path: 'fornecedor',
                component: TelaFornecedorComponent,
                data: {
                    heading: 'Fornecedor'
                  },
            },{
                path: 'clientes',
                component: TelaClienteComponent,
                data: {
                    heading: 'Clientes'
                  },
            },{
                path: 'ocorrencia',
                component: OcorrenciaComponent,
                data: {
                    heading: 'Ocorrência'
                  },
            },{
                path: 'parametrosGeraisCarga',
                component: ParametrosGeraisCargaComponent,
                data: {
                    heading: 'Parâmetros Gerais Carga'
                  },
            },{
                path: 'grupoOcorrencia',
                component: GrupoOcorrenciaComponent,
                data: {
                    heading: 'Grupo Ocorrência'
                  },
            },{
                path: 'qrcode',
                component: QrcodeComponent,
                data: {
                    heading: 'QR CODE'
                  },
            },{
                path: 'cidadeTarifa',
                component: CidadeTarifaComponent,
                data: {
                    heading: 'Cidade Tarifa'
                  },
            },{
                path: 'documentoViagem',
                component: DocumentoViagemComponent,
                data: {
                    heading: 'Documentação para viagem'
                  },
            },{
                path: 'updates',
                component: TelaUpdatesComponent,
                data: {
                    heading: 'Atualizações do sistema'
                },
            },{
                path: 'horarioCorte',
                component: HorarioCorteComponent,
                data: {
                    heading: 'Horário Corte'
                },
            },{
                path: 'naturezaCarga',
                component: NaturezaCargaComponent,
                data: {
                    heading: 'Natureza da Carga'
                },
            }

          ]
    }
];
