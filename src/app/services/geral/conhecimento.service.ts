import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ConhecimentoService {
  private global = new GlobalsServices();
  private url;
  private urlSrv;

  constructor(private http: HttpClient) {
    this.url    = this.global.getApiHostUrl();
    this.urlSrv = this.global.getApiHostSrvUrl();
  }

  atribuirData(obj){ return this.http.post<any>(this.url + "tp/conhecimento/atribuirDataEntrega", obj) };

  alterarPrevisaoEntrega(obj){ return this.http.post<any>(this.url + "tp/conhecimento/alteracaoDataPrevisaoEntrega", obj) };

  liberarConhecimento(obj){ return this.http.post<any>(this.url + "tp/conhecimento/liberarConhecimento", obj) };

  // updateStatus(obj){
	// 	return this.http.post<any>(this.urlSrv + "/evolog/logos/alterarStatusConhecimentoDelivery", obj);
	// }
}
