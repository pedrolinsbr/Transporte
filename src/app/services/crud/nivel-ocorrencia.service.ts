import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NivelOcorrenciaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#nivelOcorrencia.buscar
  getNivelOcorrencia(nivelOcorrencia) { return this.http.post<any>(this.url + "tp/niveisOcorrencia/buscar", nivelOcorrencia) };

  //#nivelOcorrencia.salvar
  addNivelOcorrencia(nivelOcorrencia) { return this.http.post<any>(this.url + "tp/niveisOcorrencia/salvar", nivelOcorrencia) };

  //#nivelOcorrencia.atualizar
  updateNivelOcorrencia(nivelOcorrencia) { return this.http.post<any>(this.url + "tp/niveisOcorrencia/atualizar", nivelOcorrencia) };

  //#nivelOcorrencia.excluir
  deleteNivelOcorrencia(nivelOcorrencia) {
    nivelOcorrencia = {'IDG066':nivelOcorrencia}
    return this.http.post<any>(this.url + "tp/niveisOcorrencia/excluir", nivelOcorrencia)
  }

}
