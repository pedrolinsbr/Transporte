import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RotasService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#Rota.buscar
  getRota(rota) { return this.http.post<any>(this.url + "tp/rota/buscarRota", rota) };

  //#Rota.salvar
  addRota(rota) { return this.http.post<any>(this.url + "tp/rota/salvarRota", rota) };

  //#Rota.atualizar
  updateRota(rota) { return this.http.post<any>(this.url + "tp/rota/atualizarRota", rota) };

  //#Rota.excluir
  deleteRota(rota) {
    rota = {'IDT001':rota}
    return this.http.post<any>(this.url + "tp/rota/excluirRota", rota)
  }

  //#Cliente.buscar
  getClientesRota(obj) { return this.http.post<any>(this.url + "tp/rota/buscarCliente", obj) };

  //#Cliente.salvar
  addCliente(rota) { return this.http.post<any>(this.url + "tp/rota/salvarCliente", rota) };

  //#Cliente.atualizar
  updateCliente(rota) { return this.http.post<any>(this.url + "tp/rota/atualizarCliente", rota) };

  //#Cliente.excluir
  deleteCliente(rota) {
    rota = {'IDT003':rota}
    return this.http.post<any>(this.url + "tp/rota/excluirCliente", rota)
  }

  //#Cidade.buscar
  getCidadeRota(obj) { return this.http.post<any>(this.url + "tp/rota/buscarCidade", obj) };

  //#Cidade.salvar
  addCidade(rota) { return this.http.post<any>(this.url + "tp/rota/salvarCidade", rota) };

  //#Cidade.atualizar
  updateCidade(rota) { return this.http.post<any>(this.url + "tp/rota/atualizarCidade", rota) };

  //#Cidade.excluir
  deleteCidade(rota) {
    rota = {'IDT002':rota}
    return this.http.post<any>(this.url + "tp/rota/excluirCidade", rota)
  }

}
