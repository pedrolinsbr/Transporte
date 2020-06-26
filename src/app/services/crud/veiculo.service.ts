import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VeiculoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  getArmazens() {
    return this.http.get<any>(this.url + "cidades")
  }

  getVeiculo(IDG003) {
    return this.http.get<any>(this.url + "cidade/" + IDG003)
  }

  getArmazensEstado(IdG002) {
    return this.http.get<any>(this.url + "cidades-estado/" + IdG002)
  }
  getClientesVeiculo(IdG003) {
    return this.http.get<any>(this.url + "cidade-clientes/" + IdG003)
  }

  addVeiculo(municipio) {
    return this.http.post<any>(this.url + "cidade", municipio)
  }

  updateVeiculo(municipio) {
    return this.http.post<any>(this.url + "cidade/" + municipio.IDG003, municipio)
  }

  deleteVeiculo(IDG003) {
    return this.http.delete<any>(this.url + "cidade/" + IDG003)
  }

}
