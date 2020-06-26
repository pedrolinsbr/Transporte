import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MobileService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#mobile.excluir
  deleteMobile(mobile) {
    mobile = {'IDG046S':mobile}
    return this.http.post<any>(this.url + "tp/mobile/cancelarMobile", mobile)
  }

  buscaParadas(obj){return this.http.post<any>(this.url + "tp/mountLoad/listarParadas", obj ) };

  saveMobile(obj){ return this.http.post<any>(this.url + "tp/mountLoad/salvarMobile", obj) };

  desmontarMobile(obj){ return this.http.post<any>(this.url + "tp/mobile/desmontarMobile", obj) };

  validaDatas(obj){ return this.http.post<any>(this.url + "tp/mountLoad/validacaoDatas", obj) };

  validaCancelar(obj){ return this.http.post<any>(this.url + "tp/mobile/validaCancelar", obj) };

  validaMobile(obj){ return this.http.post<any>(this.url + "tp/mountLoad/validarMobile", obj) };

  atriVeiculoMotorista(obj){ return this.http.post<any>(this.url + "tp/mobile/atribuirVeiculoMotorista", obj) };

  getParametros(obj){ return this.http.post<any>(this.url + "tp/parametrosGeraisMobile/listar", obj) };

  getMapaMobile(obj){ return this.http.post<any>(this.url + "tp/mobile/mapaMobile", obj) };

  qtdSituacaoMobile(){ return this.http.post<any>(this.url + "tp/mobile/qtdSituacaoMobile", null) };

}
