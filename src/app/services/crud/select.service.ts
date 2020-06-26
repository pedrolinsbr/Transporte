import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SelectService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  getCidades(cidade) {
    return this.http.get<any>(this.url + "cidades/busca/" + cidade)
  }

  getEstados(estado) {
    return this.http.get<any>(this.url + "estados/busca/" + estado)
  }

  getPaises(paises) {
    return this.http.get<any>(this.url + "paises/busca/" + paises)
  }

}
