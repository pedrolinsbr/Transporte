import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HorarioCorteService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#horarioCorte.buscar
  getHorarioCorte(horarioCorte) { return this.http.post<any>(this.url + "tp/horarioCorte/buscar", horarioCorte) };

  //#horarioCorte.salvar
  addHorarioCorte(horarioCorte) { return this.http.post<any>(this.url + "tp/horarioCorte/salvar", horarioCorte) };

  //#horarioCorte.atualizar
  updateHorarioCorte(horarioCorte) { return this.http.post<any>(this.url + "tp/horarioCorte/atualizar", horarioCorte) };

  //#horarioCorte.excluir
  deleteHorarioCorte(horarioCorte) {
    horarioCorte = {'IDG105':horarioCorte}
    return this.http.post<any>(this.url + "tp/horarioCorte/excluir", horarioCorte)
  }

}
