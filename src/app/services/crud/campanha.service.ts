import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CampanhaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#campanha.buscar
  getCampanha(campanha) { return this.http.post<any>(this.url + "tp/campanha/buscar", campanha) };

  //#campanha.salvar
  addCampanha(campanha) { return this.http.post<any>(this.url + "tp/campanha/salvar", campanha) };

  //#campanha.atualizar
  updateCampanha(campanha) { return this.http.post<any>(this.url + "tp/campanha/atualizar", campanha) };

  //#campanha.excluir
  deleteCampanha(campanha) {
    campanha = {'IDG090':campanha}
    return this.http.post<any>(this.url + "tp/campanha/excluir", campanha)
  }

}
