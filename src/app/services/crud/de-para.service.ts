import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DeParaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#dePara.buscar
  getDePara(dePara) { return this.http.post<any>(this.url + "it/dePara/buscar", dePara) };

  //#dePara.salvar
  addDePara(dePara) { return this.http.post<any>(this.url + "it/dePara/salvar", dePara) };

  //#dePara.atualizar
  updateDePara(dePara) { return this.http.post<any>(this.url + "it/dePara/atualizar", dePara) };

  //#dePara.excluir
  deleteDePara(dePara) {
    dePara = {'IDG058':dePara}
    return this.http.post<any>(this.url + "it/dePara/excluir", dePara)
  }

}
