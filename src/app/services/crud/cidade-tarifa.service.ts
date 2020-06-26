import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CidadeTarifaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#cidadetarifa.buscar
  getCidadeTarifa(cidadetarifa) { return this.http.post<any>(this.url + "tp/cidadetarifa/buscar", cidadetarifa) };

  //#cidadetarifa.salvar
  addCidadeTarifa(cidadetarifa) { return this.http.post<any>(this.url + "tp/cidadetarifa/salvar", cidadetarifa) };

  //#cidadetarifa.atualizar
  updateCidadeTarifa(cidadetarifa) { return this.http.post<any>(this.url + "tp/cidadetarifa/atualizar", cidadetarifa) };

  //#cidadetarifa.excluir
  deleteCidadeTarifa(cidadetarifa) {
    cidadetarifa = {'IDG053':cidadetarifa}
    return this.http.post<any>(this.url + "tp/cidadetarifa/excluir", cidadetarifa)
  }

}
