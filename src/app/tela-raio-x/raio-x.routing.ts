import { Routes } from '@angular/router';

import { TelaRaioXComponente } from './tela-raio-x.component';

export const RaioXRoutes: Routes = [{
	path: '',
	component: TelaRaioXComponente,
	data: {
		heading: 'Raio-X'
	}
}];
