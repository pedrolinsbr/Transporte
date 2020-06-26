import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LogService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#log.buscar
  getLog(log) { return this.http.post<any>(this.url + "tp/log/buscarLog", log) };

  //#log.listar
  addLog(log) { return this.http.post<any>(this.url + "tp/log/listarLog", log) };

  //#infoTimeLine
  listarTimeLine(obj) { return this.http.post<any>(this.url + "tp/logs/listarTimeLine", obj) };
}