import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipoApontamentoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#tipoApontamento.buscar
  getTipoApontamento(tipoApontamento) { return this.http.post<any>(this.url + "tp/tipoApontamento/buscar", tipoApontamento) };

  //#tipoApontamento.salvar
  addTipoApontamento(tipoApontamento) { return this.http.post<any>(this.url + "tp/tipoApontamento/salvar", tipoApontamento) };

  //#tipoApontamento.atualizar
  updateTipoApontamento(tipoApontamento) { return this.http.post<any>(this.url + "tp/tipoApontamento/atualizar", tipoApontamento) };

  //#tipoApontamento.excluir
  deleteTipoApontamento(tipoApontamento) {
    tipoApontamento = {'IDG092':tipoApontamento}
    return this.http.post<any>(this.url + "tp/tipoApontamento/excluir", tipoApontamento)
  }

}
