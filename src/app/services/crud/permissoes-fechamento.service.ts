import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PermissoesFechamentoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#permissoesFechamento.listar
  viewPermissoesFechamento(permissoesFechamento) { return this.http.post<any>(this.url + "tp/permissoesFechamento/listar", permissoesFechamento) };

  //#permissoesFechamento.buscar
  getPermissoesFechamento(permissoesFechamento) { return this.http.post<any>(this.url + "tp/permissoesFechamento/buscar", permissoesFechamento) };

  //#permissoesFechamento.salvar
  addPermissoesFechamento(permissoesFechamento) { return this.http.post<any>(this.url + "tp/permissoesFechamento/salvar", permissoesFechamento) };

  //#permissoesFechamento.atualizar
  updatePermissoesFechamento(permissoesFechamento) { return this.http.post<any>(this.url + "tp/permissoesFechamento/atualizar", permissoesFechamento) };

  //#permissoesFechamento.excluir
  deletePermissoesFechamento(permissoesFechamento) {
    permissoesFechamento = {'IDG103':permissoesFechamento}
    return this.http.post<any>(this.url + "tp/permissoesFechamento/excluir", permissoesFechamento)
  }

}
