import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SegurancaPremiadaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  buscaLancMotorista(obj){return this.http.post<any>(this.url + "tp/segurancapremiada/buscaLancMotorista", obj ) };

  downloadPdfM1(obj):Observable<any>{return this.http.get(this.url + 'tp/segurancapremiada/downloadPdfM1/' + obj.IDG090.id, {responseType: 'blob'});}

  downloadPdfM2(obj):Observable<any>{return this.http.get(this.url + 'tp/segurancapremiada/downloadPdfM2/' + obj.IDG090.id, {responseType: 'blob'});}

  
}
