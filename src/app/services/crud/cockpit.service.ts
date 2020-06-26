import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CockpitService {
    private global = new GlobalsServices();
    private url;

    constructor(private http: HttpClient) {
        this.url = this.global.getApiHostUrl();
    }


    atualizaMotorista(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaVeiculo(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaTipoVeiculo(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaCarga(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaDesmontarCarga(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaCancelarCarga(obj) {
        return this.http.post(`${this.url}`, obj);
    }

    atualizaSubirConhecimento(obj) {
        var urlAux = 'http://srvaplsl01.bravo.com.br/prd/evologos/public/sincronizarInf11#';
        return this.http.get(urlAux);
    }

    atualizaCarga3PL(obj) {
        var urlAux = 'http://srvaplsl01.bravo.com.br/prd/evologos/public/subirCarga3PL11#';
        return this.http.get(urlAux);
    }

    verificaCte4pl(obj) {
        var urlAux = 'http://srvaplsl01.bravo.com.br/prd/evologos/public/evolog/logos/verificarCte4pl';
        //var urlAux = 'http://localhost:8000/evolog/logos/verificarCte4pl';
        return this.http.get(urlAux, {responseType: "text"});
    }

}
