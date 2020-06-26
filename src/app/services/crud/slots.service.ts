import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SlotsService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#horario.getHorarios
  getSlots(slots){ return this.http.post<any>(this.url + "hc/slots/getSlots", slots) }

  //#slots.atribuirStatus
  atribuirStatus(slots) {
    return this.http.post<any>(this.url + "hc/slots/atribuirStatus", slots)

  }

  //#slots.atribuirStatus
  replicarStatus(slots) {
    return this.http.post<any>(this.url + "hc/slots/replicarStatus", slots)

  }


}
