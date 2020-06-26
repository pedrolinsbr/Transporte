import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HelpDeskService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  
  getInfoByCarga(filtro) { return this.http.post<any>(this.url + "tp/suporte/getInfoByCarga", filtro) };

  getInfoByMdf(filtro) { return this.http.post<any>(this.url + "tp/suporte/getInfoByMdf", filtro) };

  getIndMdfVenc(filtro) { return this.http.post<any>(this.url + "tp/suporte/getIndMdfVenc", filtro) };

  getInfoCTE(filtro) { return this.http.post<any>(this.url + "tp/suporte/getInfoCTE", filtro) };

  verificaSLA(filtro) { 
    filtro.SNCONSLA = 1;
    return this.http.post<any>(this.url + "delivery/consultaSlaDelivery", filtro) 
  };
  

}
