import { Routes                           } from '@angular/router';

// #### TELAS

/* import { TelaLogAplicacaoComponent             } from './tela-log-aplicacao/tela-log-aplicacao.component';
import { TelaLogComponent                      } from '../suporte/tela-log/tela-log.component';
//Comentando linhas pois telas foram movidas para outro modulo 
 */

export const AdministrativoRoutes: Routes = [
    {
        path: '',
        children: [
            /* {
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
            }, */
            //Comentando linhas pois telas foram movidas para outro modulo 

          ]
    }
];
