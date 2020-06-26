import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CtrcExpedirService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#carga.excluir
  deleteCarga(carga) {
    carga = {'IDG046S':carga}
    return this.http.post<any>(this.url + "tp/carga/cancelarCarga", carga)
  }

  buscaParadas(obj){return this.http.post<any>(this.url + "tp/mountLoad/listarParadas", obj ) };

  saveCarga(obj){ return this.http.post<any>(this.url + "tp/mountLoad/salvarCarga", obj) };

  desmontarCarga(obj){ return this.http.post<any>(this.url + "tp/carga/desmontarCarga", obj) };

  validaDatas(obj){ return this.http.post<any>(this.url + "tp/mountLoad/validacaoDatas", obj) };

  validaCancelar(obj){ return this.http.post<any>(this.url + "tp/carga/validaCancelar", obj) };

  validaCarga(obj){ return this.http.post<any>(this.url + "tp/mountLoad/validarCarga", obj) };

  atriVeiculoMotorista(obj){ return this.http.post<any>(this.url + "tp/carga/atribuirVeiculoMotorista", obj) };

  getParametros(obj){ return this.http.post<any>(this.url + "tp/parametrosGeraisCarga/listar", obj) };

  getMapaCarga(obj){ return this.http.post<any>(this.url + "tp/carga/mapaCarga", obj) };

  getMapaExpedicao(obj){ return this.http.post<any>(this.url + "tp/carga/mapaExpedicao", obj) };

  getDeliverysCarga(obj){ return this.http.post<any>(this.url + "tp/carga/deliverysCarga", obj) };

  getDeliverysSelecionadasCarga(obj){
    obj = {'IDG043S':obj}
    return this.http.post<any>(this.url + "tp/carga/deliverysSelecionadasCarga", obj)
  };

  qtdSituacaoCargas(){ return this.http.post<any>(this.url + "tp/carga/qtdSituacaoCargas", null) };


  salvarReprocessarCarga(obj){return this.http.post<any>(this.url + "tp/montagemCarga/salvarReprocessarCarga", obj) };

  validaMontarCarga4PL(obj){ return this.http.post<any>(this.url + "tp/carga/validaMontarCarga4PL", obj) };

  totalCarga(obj){ return this.http.post<any>(this.url + "tp/carga/qtdTotal", obj) };

  getArmazemColeta(obj){ return this.http.post<any>(this.url + "tp/montagemCarga/getArmazemColeta", obj) };

  getCapacidadePeso(obj){ return this.http.post<any>(this.url + "tp/montagemCarga/getCapacidadePeso", obj) };

  setTipoTransporte(obj){ return this.http.post<any>(this.url + "tp/montagemCarga/setTipoTransporte", obj) };

  atribuicaoMobileCarga(carga){
    carga = {'IDG046':carga}
    return this.http.post<any>(this.url + "tp/carga/atribuicaoMobileCarga", carga)
  };

  getManifesto(obj) { return this.http.post<any>(this.url + "tp/carga/getManifesto", obj) };

  savePrintLog(obj) { return this.http.post<any>(this.url + "tp/carga/savePrintLog", obj) };

  listPrintLog(obj) { return this.http.post<any>(this.url + "tp/carga/listPrintLog", obj) };

}
