import { Routes                           } from '@angular/router';
import { CargaParadasComponent            } from './carga-paradas/carga-paradas.component';
import { ConhecimentoDeliveryComponent    } from './conhecimento-delivery/conhecimento-delivery.component';
import { SegurancaPremiadaComponent       } from './seguranca-premiada/seguranca-premiada.component';
import { CtrcExpedirComponent             } from './ctrc-expedir/ctrc-expedir.component';
import { AnaliseCargaComponent            } from './analise-carga/analise-carga.component';
import { DocumentoPendenteCargaComponent  } from './documento-pendente-carga/documento-pendente-carga.component';
import { LancamentoComponent              } from './lancamento/lancamento.component';

export const RelatorioRoutes: Routes = [
    {
        path: '',
        children: [
           {
                path: 'carga-paradas',
                component: CargaParadasComponent,
                data: {
                    heading: 'Carga/Paradas'
                },
            },{
                path: 'conhecimento-delivery',
                component: ConhecimentoDeliveryComponent,
                data: {
                    heading: 'Conhecimento/Delivery'
                }
            },{
                path: 'seguranca-premiada',
                component: SegurancaPremiadaComponent,
                data: {
                    heading: 'Segurança PREMIADA'
                },
            },{
                path: 'ctrc-expedir',
                component: CtrcExpedirComponent,
                data: {
                    heading: 'CTRC a expedir'
                },
            },{
                path: 'analise-carga',
                component: AnaliseCargaComponent,
                data: {
                    heading: 'Análise de carga'
                },
            },{
                path: 'documento-pendente-carga',
                component: DocumentoPendenteCargaComponent,
                data: {
                    heading: 'Documentos pendentes da carga'
                },
            },{
                path: 'lancamento',
                component: LancamentoComponent,
                data: {
                    heading: 'Lançamento'
                },
            }
        ]
    }
];
