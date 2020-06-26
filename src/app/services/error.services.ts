/************************
COMPONENTES/PLUGINS
************************/
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

/************************
PROVIDERS
************************/

@Injectable()
export class ErrorServices {


	constructor(
		private toastr: ToastrService
	) { }
	
	errors = {
		1001: 'Usuário ou senha inválidos!',
		1002: 'Preencha todos os campos!',
		1003: 'Permissão negada. Favor encontrar em contato com o administrador!'
	}

	success = {
		1001: 'Sua nova senha foi enviada para seu e-mail!'
	}

	/************
	SHOW ERROR
	*************/
	showError(code:number){
        return this.errors[code];
	}
	
	/************
	SHOW SUCESSS
	*************/
	showSuccess(code:number){
        return this.success[code];
    }

	alertError(err) {
		console.log('alert');
		console.log(err);
		var user = JSON.parse(window.localStorage.getItem('user'));

		var messages = new Array();
		if (err._body !== "") {
			console.log(err._body);
			if(err._body.type == "error"){
				this.toastr.error("Conexão inválida");
				return false;
			}
			var errJson = JSON.parse(err._body);
			if (errJson.errors) {
				var erros = Object.keys(errJson.errors).map((e) => messages.push(errJson.errors[e]));
			}
			if (errJson.error) {
				console.log('else if');
				console.log(errJson.error);
				var erros = Object.keys(errJson.error).map((e) => messages.push(errJson.error[e]));
			}
		}
		else {
			messages.push(err.statusText);
		}
		console.log('errJson');
		console.log(errJson);

		var error = "";
		switch (err.status) {
			case 400:
				console.log(messages);
				error = messages[0];
				break;
			case 401:
				console.log('401');
				console.log(user);
				break;
			case 404:
				error = errJson.message;
				break;
			case 405:
				error = err.message;
				break;
			case 422:
				error = errJson.message;
				break;
			case 500:
				error = errJson.message;
				break;
		}
		this.toastr.error(error);
	}


}