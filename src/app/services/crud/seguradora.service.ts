import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SeguradoraService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#ROTAS SEGURADORA
  getSeguradora   (seguradora) { return this.http.post<any>(this.url + "tp/seguradora/buscar",    seguradora) };
  addSeguradora   (seguradora) { return this.http.post<any>(this.url + "tp/seguradora/salvar",    seguradora) };
  updateSeguradora(seguradora) { return this.http.post<any>(this.url + "tp/seguradora/atualizar", seguradora) };
  deleteSeguradora(rota) {
    rota = {'IDG041':rota}
    return this.http.post<any>(this.url + "tp/seguradora/excluir", rota)
  }

  //#ROTAS APOLICE
  getApolice(apolice)   { return this.http.post<any>(this.url + "tp/apolice/buscar",    apolice) };
  addApolice(apolice)   { return this.http.post<any>(this.url + "tp/apolice/salvar",    apolice) };
  updateApolice(apolice){ return this.http.post<any>(this.url + "tp/apolice/atualizar", apolice) };
  deleteApolice(apolice){
    apolice = {'IDG047':apolice}
    return this.http.post<any>(this.url + "tp/apolice/excluir", apolice)
  }


}
