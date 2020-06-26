/************************
COMPONENTES/PLUGINS
************************/
import { Injectable } from '@angular/core';
import * as $ from 'jquery';

/************************
PROVIDERS
************************/

@Injectable()
class globalsVariables{
	isLogged:boolean;
	showNav:boolean;
}

export class GlobalsServices {

	//private api = "http://52.86.6.188:3000/api/";
	//public api = "http://192.10.9.3:3000/api/";
	public api = "http://localhost:3000/api/";

	isBusyForm: boolean = false;

	getApiHost(){
		var url = "";
	    $.ajax({url:"assets/env/env.json", async: false, success: function(result){

			localStorage.setItem('URL_SRV', result.URL_SRV);
			var url_atual = window.location.href;
			var url_https = url_atual.slice(0, 5);

			if (url_https == 'https') { 
				url = result.URL_API_S;
		        localStorage.setItem('URL_API', result.URL_API_S);
		        localStorage.setItem('URL_INT', result.URL_INT_S);
			} else {
				url = result.URL_API;
		        localStorage.setItem('URL_API', result.URL_API);
		        localStorage.setItem('URL_INT', result.URL_INT);
			}

		}});
	   return url;
	}


	getApiHostUrl(){
		var url = "";
		url = localStorage.getItem('URL_API');
	   return url;
	}

	getApiHostSrvUrl(){
		var url = "";
		url = localStorage.getItem('URL_SRV');
	   return url;
	}

	private globalsVariables = new globalsVariables();

	/************
	GET VARIAVEL
	*************/
	getVariavel(nome_variavel){
		return this.globalsVariables[nome_variavel];
	}

	/************
	SET VARIAVEL
	*************/
	setVariavel(nome_variavel, valor){
		this.globalsVariables[nome_variavel] = valor;
		return this.globalsVariables;
	}

	Lpad(num:string, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

	formataShipment (param) {
		const base      	= 1000000;
		const nrASCII     = 65; //A

		let idCarga 			= 		parseInt(param.idCarga)
		let quociente     = 		Math.floor(idCarga / base)
		let letra        	= 		String.fromCharCode(nrASCII + quociente);
		let strCarga    	= 		String(idCarga - (base * quociente));

		let strShipment 	= 		letra + this.Lpad(strCarga, 6);


		if (param.hasOwnProperty('nrEtapa'))
				strShipment += '-' + this.Lpad(String(param.nrEtapa),  2);

		return strShipment;
}

incluirShipmentFormatado(arData){

	let SHIPMENT_FORMATED;
	for (let key in arData) {
		SHIPMENT_FORMATED = this.formataShipment({ idCarga: arData[key].IDCARGA, nrEtapa: arData[key].NRETAPA });
		arData[key].SHIPMENT_FORMATED = SHIPMENT_FORMATED;
	}
	return arData;

}
mapPages;
routePag(page){
  this.mapPages = {aceite:false, descarga:false, infoCarga:false, edicaoCarga: false, grade:false, consulta_grade:false, consulta_protocolo:false};
  this.mapPages[page] = true;
  // console.log("mapPage>>> ", this.mapPages[page]);
 }

}
