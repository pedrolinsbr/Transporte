import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

import { GlobalsServices } from '../globals.services';

@Injectable()
export class EstadosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) { this.url = this.global.getApiHost() };

  getEstados() { return this.http.get<any>(this.url + "estados") };

  getEstado(IDG002) { return this.http.get<any>(this.url + "estado/" + IDG002) };

  getEstadosPais(IDG001) { return this.http.get<any>(this.url + "estados-pais/" + IDG001) };

  addEstado(estado) { return this.http.post<any>(this.url + "estado", estado) };

  updateEstado(estado) { return this.http.post<any>(this.url + "estado/" + estado.IDG001, estado) };

  deleteEstado(IDG002) { return this.http.delete<any>(this.url + "estado/" + IDG002) };
}
