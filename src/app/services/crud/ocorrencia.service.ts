import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OcorrenciaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#ocorrencia.buscar
  getOcorrencia(ocorrencia) { return this.http.post<any>(this.url + "tp/ocorrencia/buscar", ocorrencia) };

  //#ocorrencia.salvar
  addOcorrencia(ocorrencia) { return this.http.post<any>(this.url + "tp/ocorrencia/salvar", ocorrencia) };

  //#ocorrencia.atualizar
  updateOcorrencia(ocorrencia) { return this.http.post<any>(this.url + "tp/ocorrencia/atualizar", ocorrencia) };

  //#ocorrencia.excluir
  deleteOcorrencia(ocorrencia) {
    ocorrencia = {'IDG067':ocorrencia}
    return this.http.post<any>(this.url + "tp/ocorrencia/excluir", ocorrencia)
  }

}
