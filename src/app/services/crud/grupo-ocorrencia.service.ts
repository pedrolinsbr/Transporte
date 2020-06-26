import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GrupoOcorrenciaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#grupoOcorrencia.buscar
  getGrupoOcorrencia(grupoOcorrencia) { return this.http.post<any>(this.url + "tp/grupoOcorrencia/buscar", grupoOcorrencia) };

  //#grupoOcorrencia.salvar
  addGrupoOcorrencia(grupoOcorrencia) { return this.http.post<any>(this.url + "tp/grupoOcorrencia/salvar", grupoOcorrencia) };

  //#grupoOcorrencia.atualizar
  updateGrupoOcorrencia(grupoOcorrencia) { return this.http.post<any>(this.url + "tp/grupoOcorrencia/atualizar", grupoOcorrencia) };

  //#grupoOcorrencia.excluir
  deleteGrupoOcorrencia(grupoOcorrencia) {
    grupoOcorrencia = {'IDG070':grupoOcorrencia}
    return this.http.post<any>(this.url + "tp/grupoOcorrencia/excluir", grupoOcorrencia)
  }



  //#grupoOcorrencia.buscar
  getUsuarioGrupoOcorrencia(usuarioGrupo) { return this.http.post<any>(this.url + "tp/usuarioGrupoOcorrencia/buscar", usuarioGrupo) };

  //#usuarioGrupo.salvar
  addUsuarioGrupoOcorrencia(usuarioGrupo) { return this.http.post<any>(this.url + "tp/usuarioGrupoOcorrencia/salvar", usuarioGrupo) };

  //#usuarioGrupo.atualizar
  updateUsuarioGrupoOcorrencia(usuarioGrupo) { return this.http.post<any>(this.url + "tp/usuarioGrupoOcorrencia/atualizar", usuarioGrupo) };

  //#usuarioGrupo.excluir
  deleteUsuarioGrupoOcorrencia(usuarioGrupo) {
    usuarioGrupo = {'IDG071':usuarioGrupo}
    return this.http.post<any>(this.url + "tp/usuarioGrupoOcorrencia/excluir", usuarioGrupo)
  }

}
