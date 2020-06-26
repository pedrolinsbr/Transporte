import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LiberacaoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }
  //
  // //#dePara.buscar
  // getLiberacao(dePara) { return this.http.post<any>(this.url + "it/dePara/buscar", dePara) };
  //
  // //#dePara.salvar
  // addLiberacao(dePara) { return this.http.post<any>(this.url + "it/dePara/salvar", dePara) };
  //
  // //#dePara.atualizar
  // updateLiberacao(dePara) { return this.http.post<any>(this.url + "it/dePara/atualizar", dePara) };
  //
  // //#dePara.excluir
  // deleteLiberacao(dePara) {
  //   dePara = {'IDG028':dePara}
  //   return this.http.post<any>(this.url + "it/dePara/excluir", dePara)
  // }

  aprovarLiberacao(dePara) { return this.http.post<any>(this.url + "tp/liberacaoOcorrencia/aprovar" , dePara) };
  reprovarLiberacao(dePara){ return this.http.post<any>(this.url + "tp/liberacaoOcorrencia/reprovar", dePara) };

}
