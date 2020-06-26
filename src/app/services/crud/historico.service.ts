import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HistoricoService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#historico.buscar
  getHistorico(historico) { return this.http.post<any>(this.url + "tp/historicoOcorrencia/buscar", historico) };

  //#historico.salvar
  addHistorico(historico) { return this.http.post<any>(this.url + "tp/historicoOcorrencia/salvar", historico) };

  //#historico.atualizar
  updateHistorico(historico) { return this.http.post<any>(this.url + "tp/historicoOcorrencia/atualizar", historico) };

  //#historico.excluir
  deleteHistorico(historico) {
    historico = {'IDG012':historico}
    return this.http.post<any>(this.url + "tp/historicoOcorrencia/excluir", historico)
  }

}
