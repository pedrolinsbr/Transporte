import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParametrosGeraisCargaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#parametro.buscar
  getParametro(parametro) { return this.http.post<any>(this.url + "tp/parametrosGeraisCarga/buscar", parametro) };

  //#parametro.salvar
  addParametro(parametro) { return this.http.post<any>(this.url + "tp/parametrosGeraisCarga/salvar", parametro) };

  //#parametro.atualizar
  updateParametro(parametro) { return this.http.post<any>(this.url + "tp/parametrosGeraisCarga/atualizar", parametro) };

  //#parametro.excluir
  deleteParametro(parametro) {
    parametro = {'IDG069':parametro}
    return this.http.post<any>(this.url + "tp/parametrosGeraisCarga/excluir", parametro)
  }



}
