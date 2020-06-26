import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NaturezaCargaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

   //#natureza.atualizarValida
   updateValida(natureza) { return this.http.post<any>(this.url + "tp/naturezaCarga/atualizarValida", natureza) };

  
  

}