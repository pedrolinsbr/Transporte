import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParametrosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#parametros.horarios
  getHorarios(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/horarios", parametro)

  }

  //#parametros.buscar
  getParametro(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/buscar", parametro)

  }

  //#parametros.listarIntervalo
  getListagemIntervalos(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/listarIntervalo", parametro)

  }

  //#parametros.salvar
  addParametro(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/salvar", parametro)

  }

  //#parametros.salvarHorarios
  addHorarios(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/salvarHorarios", parametro)

  }


  //#parametros.atualizar
  updateParametro(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/atualizar", parametro)

  }

  //#parametros.excluir
  deleteParametro(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/excluir", parametro)

  }

  //#parametros.verificaAgendaCriada
  verificaAgendaCriada(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/verificaAgendaCriada", parametro)

  }

  //#parametros.gerarAgenda
  gerarAgenda(parametro) {
    return this.http.post<any>(this.url + "hc/horario/gerarAgenda", parametro)

  }

  //#parametros.deleteSlots
  deleteSlots(parametro) {
    return this.http.post<any>(this.url + "hc/horario/deleteSlots", parametro)

  }



  //
  //  INTERVALOS
  // 
  ////////////////////////////////////////////////////////////////////////////

  //#parametros.excluir
  deleteIntervalo(intervalo) {
    return this.http.post<any>(this.url + "hc/parametros/excluirIntervalo", intervalo)

  }

  //#parametros.salvarIntervalo
  addIntervalo(intervalo) {
    return this.http.post<any>(this.url + "hc/parametros/salvarIntervalo", intervalo)

  }

  //#parametros.atualizarIntervalo
  updateIntervalo(intervalo) {
    return this.http.post<any>(this.url + "hc/parametros/atualizarIntervalo", intervalo)

  }

  //#parametros.intervalos
  getUpdateIntervalo(parametro) {
    return this.http.post<any>(this.url + "hc/parametros/intervalos", parametro)

  }

  ////////////////////////////////////////////////////////////////////////////

}
