import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MotoristaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#motorista.buscar
  getMotorista(motorista) {
    return this.http.post<any>(this.url + "hc/motorista/buscar", motorista)

  }


  //#motorista.salvar
  addMotorista(motorista) {
    return this.http.post<any>(this.url + "hc/motorista/salvar", motorista)

  }


  //#motorista.atualizar
  updateMotorista(motorista) {
    return this.http.post<any>(this.url + "hc/motorista/atualizar", motorista)

  }

  //#motorista.excluir
  deleteMotorista(motorista) {
    motorista = {'IDG031':motorista}
    return this.http.post<any>(this.url + "hc/motorista/excluir", motorista)

  }

}
