import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TransportadoraService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#transportadora.buscar
  getTransportadora(transportadora) {
    return this.http.post<any>(this.url + "hc/transportadora/buscar", transportadora)

  }


  //#transportadora.salvar
  addTransportadora(transportadora) {
    return this.http.post<any>(this.url + "hc/transportadora/salvar", transportadora)

  }


  //#transportadora.atualizar
  updateTransportadora(transportadora) {
    return this.http.post<any>(this.url + "hc/transportadora/atualizar", transportadora)

  }

  //#transportadora.excluir
  deleteTransportadora(transportadora) {
    transportadora = {'IDG024':transportadora}
    return this.http.post<any>(this.url + "hc/transportadora/excluir", transportadora)

  }

}
