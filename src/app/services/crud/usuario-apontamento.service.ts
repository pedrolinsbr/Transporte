import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsuarioApontamentoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#usuarioApontamento.buscar
  getUsuarioApontamento(usuarioApontamento) { return this.http.post<any>(this.url + "tp/usuarioApontamento/buscar", usuarioApontamento) };

  //#usuarioApontamento.salvar
  addUsuarioApontamento(usuarioApontamento) { return this.http.post<any>(this.url + "tp/usuarioApontamento/salvar", usuarioApontamento) };

  //#usuarioApontamento.atualizar
  updateUsuarioApontamento(usuarioApontamento) { return this.http.post<any>(this.url + "tp/usuarioApontamento/atualizar", usuarioApontamento) };

  //#usuarioApontamento.excluir
  deleteUsuarioApontamento(usuarioApontamento) {
    usuarioApontamento = {'IDG101':usuarioApontamento}
    return this.http.post<any>(this.url + "tp/usuarioApontamento/excluir", usuarioApontamento)
  }

}
