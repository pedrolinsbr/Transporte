import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MdfeService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  buscaMdfe(obj){return this.http.post<any>(this.url + "tp/mdfe/buscarMdfe", obj ) };

  buscaPercurso(obj){return this.http.post<any>(this.url + "tp/mdfe/listarPercurso", obj ) };

  salvarMdfe(obj){return this.http.post<any>(this.url + "tp/mdfe/salvarMdfe", obj ) };

  atualizarMdfe(obj){return this.http.post<any>(this.url + "tp/mdfe/atualizarMdfe", obj ) };

  salvarTrocaStatus(obj){return this.http.post<any>(this.url + "tp/mdfe/salvarTrocaStatus", obj ) };

  downloadXmlMdfe(obj):Observable<any>{return this.http.get(this.url + 'tp/mdfe/downloadXmlMdfe/' + obj.IDF001, {responseType: 'blob'});}

  downloadPdfMdfe(obj):Observable<any>{return this.http.get(this.url + 'tp/mdfe/downloadPdfMdfe/' + obj.IDF001, {responseType: 'blob'});}
  
  validarCarga(obj){return this.http.post<any>(this.url + "tp/mdfe/validarCarga", obj ) };

  validarPdfMdfe(obj){return this.http.post<any>(this.url + "tp/mdfe/validarPdfMdfe", obj ) };
  
}
