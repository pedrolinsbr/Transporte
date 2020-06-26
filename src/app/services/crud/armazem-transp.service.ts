import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ArmazemtranspService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#ArmazemTransp.buscar
  getArmazemTransp(armazemTransp) { return this.http.post<any>(this.url + "tp/armazemTransp/buscarArmazemTransp", armazemTransp) };

  //#ArmazemTransp.salvar
  addArmazemTransp(armazemTransp) { return this.http.post<any>(this.url + "tp/armazemTransp/salvarArmazemTransp", armazemTransp) };

  //#ArmazemTransp.atualizar
  updateArmazemTransp(armazemTransp) { return this.http.post<any>(this.url + "tp/armazemTransp/atualizarArmazemTransp", armazemTransp) };

  //#ArmazemTransp.excluir
  deleteArmazemTransp(armazemTransp) {
    armazemTransp = {'IDG084':armazemTransp}
    return this.http.post<any>(this.url + "tp/armazemTransp/excluirArmazemTransp", armazemTransp)
  }
}
