import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TempoArmazemService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }


  //#tempoArmazem.status
  getArmazem(tempoArmazem) {
    return this.http.post<any>(this.url + "hc/tempoArmazem/buscar", tempoArmazem)
  }


  //#tempoArmazem.salvar
  addTempoArmazem(tempoArmazem) {
    return this.http.post<any>(this.url + "hc/tempoArmazem/salvar", tempoArmazem)
  }


  //#tempoArmazem.atualizar
  updateTempoArmazem(tempoArmazem) {
    return this.http.post<any>(this.url + "hc/tempoArmazem/atualizar", tempoArmazem)
  }

  //#tempoArmazem.excluir
  deleteTempoArmazem(tempoArmazem) {
    tempoArmazem = {'IDH015':tempoArmazem}
    return this.http.post<any>(this.url + "hc/tempoArmazem/excluir", tempoArmazem)
  }

}
