import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfiguracaoJanelaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#janela.buscar
  getJanela(janela) { return this.http.post<any>(this.url + "hc/configuracaoJanela/buscar", janela) }

  //#janela.salvar
  addJanelas(janela) { return this.http.post<any>(this.url + "hc/configuracaoJanela/salvar", janela) }

  //#janela.atualizar
  updateJanelas(janela) { return this.http.post<any>(this.url + "hc/configuracaoJanela/atualizar", janela) }

  //#janela.excluir
  deleteJanelas(janela) {
    janela = {'IDH005':janela}
    return this.http.post<any>(this.url + "hc/configuracaoJanela/excluir", janela)

  }

}
