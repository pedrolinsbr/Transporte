import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TempoCargaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  getArmazens() {
    return this.http.get<any>(this.url + "cidades")
  }

  getTempoCarga(IDG003) {
    return this.http.get<any>(this.url + "cidade/" + IDG003)
  }

  getArmazensEstado(IdG002) {
    return this.http.get<any>(this.url + "cidades-estado/" + IdG002)
  }

  getClientesTempoCarga(IdG003) {
    return this.http.get<any>(this.url + "cidade-clientes/" + IdG003)
  }

  addTempoCarga(municipio) {
    return this.http.post<any>(this.url + "cidade", municipio)
  }

  updateTempoCarga(municipio) {
    return this.http.post<any>(this.url + "cidade/" + municipio.IDG003, municipio)
  }

  deleteTempoCarga(IDG003) {
    return this.http.delete<any>(this.url + "cidade/" + IDG003)
  }

}
