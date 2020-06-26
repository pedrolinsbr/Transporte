import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GrupoTransportadoraService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#grupoTransportadora.buscar
  getGrupoTransportadora(grupoTransportadora) { return this.http.post<any>(this.url + "hc/grupoTransportadora/buscar", grupoTransportadora) };


  //#grupoTransportadora.salvar
  addGrupoTransportadora(grupoTransportadora) { return this.http.post<any>(this.url + "hc/grupoTransportadora/salvar", grupoTransportadora) };


  //#grupoTransportadora.atualizar
  updateGrupoTransportadora(grupoTransportadora) { return this.http.post<any>(this.url + "hc/grupoTransportadora/atualizar", grupoTransportadora) };

  //#grupoTransportadora.excluir
  deleteGrupoTransportadora(grupoTransportadora) {
    grupoTransportadora = {'IDG023':grupoTransportadora}
    return this.http.post<any>(this.url + "hc/grupoTransportadora/excluir", grupoTransportadora)
  }

}
