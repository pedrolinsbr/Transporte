import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ClusterService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#cluster.buscar
  getCluster(cluster) { return this.http.post<any>(this.url + "tp/rota/buscarCluster", cluster) };

  //#cluster.salvar
  addCluster(cluster) { return this.http.post<any>(this.url + "tp/rota/salvarCluster", cluster) };

  //#cluster.atualizar
  updateCluster(cluster) { return this.http.post<any>(this.url + "tp/rota/atualizarCluster", cluster) };

  //#cluster.excluir
  deleteCluster(cluster) {
    cluster = {'IDT005':cluster}
    return this.http.post<any>(this.url + "tp/rota/excluirCluster", cluster)
  }

}