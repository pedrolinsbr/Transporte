import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TempoStatusService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#tempoStatus.buscar
  getConfiguracao(tempoStatus) {
    return this.http.post<any>(this.url + "hc/tempoStatus/buscar", tempoStatus)
  }


  //#tempoStatus.status
  getStatus(tempoStatus) {
    return this.http.post<any>(this.url + "hc/tempoStatus/buscarStatus", tempoStatus)
  }


  //#tempoStatus.salvar
  addTempoStatus(tempoStatus) {
    return this.http.post<any>(this.url + "hc/tempoStatus/salvar", tempoStatus)
  }


  //#tempoStatus.atualizar
  updateTempoStatus(tempoStatus) {
    return this.http.post<any>(this.url + "hc/tempoStatus/atualizar", tempoStatus)
  }

  //#tempoStatus.excluir
  deleteTempoStatus(tempoStatus) {
    tempoStatus = {'IDH015':tempoStatus}
    return this.http.post<any>(this.url + "hc/tempoStatus/excluir", tempoStatus)
  }

}
