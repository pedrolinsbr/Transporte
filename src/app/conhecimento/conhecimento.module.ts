//  ###### COMPONENTES
import { NgModule              } from '@angular/core';
import { RouterModule          } from '@angular/router';
import { CommonModule          } from '@angular/common';
import { NgxChartsModule       } from '@swimlane/ngx-charts';
import { NgbModule,
         NgbDatepickerI18n,
         NgbTabChangeEvent     } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule         } from 'ng2-dragula';
import { MatChipsModule        } from '@angular/material/chips';
import { MatIconModule         } from '@angular/material/icon';
import { MatFormFieldModule    } from '@angular/material/form-field';
import { FormsModule,
         ReactiveFormsModule   } from '@angular/forms';
import { TranslateModule,
        TranslateLoader        } from '@ngx-translate/core';
import { TranslateHttpLoader   } from '@ngx-translate/http-loader';
import { HttpClient,
        HttpClientModule       } from '@angular/common/http';


//  ##### ROUTES
import { ConhecimentoRoutes    } from './conhecimento.routing';

//  ###### TELAS
import { ConhecimentoComponent } from './conhecimento.component';

//  ###### COMPONENTES BRAVO
import { CompBravoModule       } from '../shared/componentesbravo/src/app/comp-bravo.module';



export function createTranslateLoader(http: HttpClient) {
  var URL_INT = localStorage.getItem('URL_INT');
  return new TranslateHttpLoader(http, URL_INT+'/locales/', '.json');
}


import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatCardModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ConhecimentoRoutes),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxChartsModule,
    CompBravoModule,
    DragulaModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    ReactiveFormsModule,


    // CHIPAO
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  declarations: [
    ConhecimentoComponent,
  ],
  providers: [

  ],
  exports:[
    // CHIPAO
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatCardModule
  ]

})

export class ConhecimentoModule {}
