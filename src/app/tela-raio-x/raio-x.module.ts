import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CompBravoModule } from '../shared/componentesbravo/src/app/comp-bravo.module';

import { TelaRaioXComponente } from './tela-raio-x.component';
import { RaioXRoutes } from './raio-x.routing';

import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';

import {
	MatButtonModule,
	MatMenuModule,
	MatToolbarModule,
	MatCardModule
  } from '@angular/material';

import { FileUploadModule } from 'ng2-file-upload';

import { PipeModule } from '../shared/componentesbravo/src/app/pipes/pipe.module';


// import { DatagridComponent } from './../componentes/datagrid/datagrid.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(RaioXRoutes),
		CompBravoModule,
		ReactiveFormsModule,
		FormsModule,
		LoadingModule.forRoot({
			animationType: ANIMATION_TYPES.threeBounce,
			backdropBackgroundColour: 'rgba(148, 147, 147, 0.7)',
			primaryColour: '#ffffff',
			secondaryColour: '#ffffff',
			tertiaryColour: '#ffffff'
		}),
		MatChipsModule,
		MatFormFieldModule,
		PipeModule.forRoot(),
	
		// CHIPAO
		MatButtonModule,
		MatMenuModule,
		MatToolbarModule,
		MatIconModule,
		MatCardModule,
		FileUploadModule
		
	],
	declarations: [
		TelaRaioXComponente
	
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

export class RaioXModule {}
