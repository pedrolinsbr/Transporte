import { Routes                           } from '@angular/router';

// #### TELAS
import { HelpDeskMdfComponent           } from './help-desk-mdf/help-desk-mdf.component'
import { HelpDeskCteComponent } from './help-desk-cte/help-desk-cte.component'
import { HelpDeskSlaDeliveryComponent } from './help-desk-sla-delivery/help-desk-sla-delivery.component';
import { HelpDeskAverbacaoComponent } from './help-desk-averbacao/help-desk-averbacao.component'

import { TelaLogAplicacaoComponent             } from './tela-log-aplicacao/tela-log-aplicacao.component';
import { TelaLogComponent                      } from './tela-log/tela-log.component';



export const SuporteRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'help-desk-mdf',
                component: HelpDeskMdfComponent,
                data: {
                    heading: 'Help Desk - Manifesto Eletrônico de Documentos Fiscais'
                },
            },
            {
                path: 'help-desk-cte',
                component: HelpDeskCteComponent,
                data: {
                    heading: 'Help Desk - Conhecimento de Transporte'
                },
            },
            {
                path: 'help-desk-sla-delivery',
                component: HelpDeskSlaDeliveryComponent,
                data: {
                    heading: 'Help Desk - Verificação de SLA de Delivery'
                },
            },
            {
                path: 'help-desk-averbacao',
                component: HelpDeskAverbacaoComponent,
                data: {
                    heading: 'Help Desk - Averbação'
                },
            },{
                path: 'log',
                component: TelaLogComponent,
                data: {
                    heading: 'Log'
                  },
            },{
                path: 'logaplicacao',
                component: TelaLogAplicacaoComponent,
                data: {
                    heading: 'LogAplicacao'
                  },
            },
           

          ]
    }
];
