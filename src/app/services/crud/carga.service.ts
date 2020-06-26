import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CargaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#dePara.buscar
  getCarga(dePara) { return this.http.post<any>(this.url + "it/dePara/buscar", dePara) };

  //#dePara.salvar
  addCarga(dePara) { return this.http.post<any>(this.url + "it/dePara/salvar", dePara) };

  //#dePara.atualizar
  updateCarga(dePara) { return this.http.post<any>(this.url + "it/dePara/atualizar", dePara) };

  //#dePara.excluir
  deleteCarga(dePara) {
    dePara = {'IDG028':dePara}
    return this.http.post<string>(this.url + "it/dePara/excluir", dePara)
  }


}
