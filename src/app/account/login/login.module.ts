import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginRoutes } from './login.routing';
import { LoginComponent } from './login.component';
import { SessionServices } from '../../services/session.services';
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';
import { ErrorServices } from '../../services/error.services';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRoutes),
    FormsModule,
    ReactiveFormsModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.threeBounce,
      backdropBackgroundColour: 'rgba(148, 147, 147, 1)',
      primaryColour: '#ffffff', 
      secondaryColour: '#ffffff', 
      tertiaryColour: '#ffffff'
    })
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    SessionServices,
    GlobalsServices,
    ErrorServices
  ]
})

export class LoginModule {}
