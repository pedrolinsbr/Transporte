import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class QrcodeService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#qrcode.buscar
  getQrcode(qrcode) { return this.http.post<any>(this.url + "tp/qrcode/buscar", qrcode) };

  //#qrcode.salvar
  addQrcode(qrcode) { return this.http.post<any>(this.url + "tp/qrcode/salvar", qrcode) };

  //#qrcode.atualizar
  updateQrcode(qrcode) { return this.http.post<any>(this.url + "tp/qrcode/atualizar", qrcode) };

  //#qrcode.atualizar
  atualizarMotorista(qrcode) { return this.http.post<any>(this.url + "tp/qrcode/atualizarMotorista", qrcode) };


  //#qrcode.excluir
  deleteQrcode(qrcode) {
    qrcode = {'IDM001':qrcode}
    return this.http.post<any>(this.url + "tp/qrcode/excluir", qrcode)
  }

}
