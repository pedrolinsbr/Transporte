import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DocumentoPendenteCargaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#dePara.buscar
  getdados(obj) { return this.http.post<any>(this.url + "tp/documentoPendenteCarga/buscar", obj) };

  
}
