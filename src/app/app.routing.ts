import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { RecoveryComponent } from './account/recovery/recovery.component';
import { SignupComponent } from './account/signup/signup.component';



export const AppRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [

      {
        path: 'cadastros',
        loadChildren: './cadastros/cadastros.module#CadastrosModule'
      },{
        path: 'administrativo',
        loadChildren: './administrativo/administrativo.module#AdministrativoModule'
      },{
        path: 'relatorio',
        loadChildren: './relatorio/relatorio.module#RelatorioModule'
      },{
        path: 'montagemCarga',
        loadChildren: './montar-carga/montar-carga.module#MontarCargaModule'
      },
      {
        path: 'mountingLoad',
        loadChildren: './mounting-load/mounting-load.module#MountingLoadModule'
      },
      {
        path: 'cargas',
        loadChildren: './carga/carga.module#CargaModule'
      },
      {
        path: 'driversScore',
        loadChildren: './drivers-score/drivers-score.module#DriversScoreModule'
      },
      {
        path: 'liberacaoOcorrencias',
        loadChildren: './liberacao/liberacao.module#LiberacaoModule'
      },{
        path: 'cockpit',
        loadChildren: './cockpit/cockpit.module#CockpitModule'
      },{
        path: 'conhecimento',
        loadChildren: './conhecimento/conhecimento.module#ConhecimentoModule'
      },{
        path: 'nota',
        loadChildren: './nota/nota.module#NotaModule'
      },{
        path: 'liberarConhecimento',
        loadChildren: './liberar-conhecimento/liberar-conhecimento.module#LiberarConhecimentoModule'
      },
      {
        path: 'mobile',
        loadChildren: './mobile/mobile.module#MobileModule'
      },
      {
        path: 'malote',
        loadChildren: './malote/malote.module#MaloteModule'
      },
      {
        path: 'raio-x',
        loadChildren: './tela-raio-x/raio-x.module#RaioXModule'
      },
      {
        path: 'mdf-e',
        loadChildren: './mdf-e/mdf-e.module#MdfeModule'
      },{
        path: 'suporte',
        loadChildren: './suporte/suporte.module#SuporteModule'
      }

    ]
  },
  {
    path: 'admin',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: './account/login/login.module#LoginModule'
      },
      {
        path: 'recovery',
        component: RecoveryComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      }
    ]
  }

];
