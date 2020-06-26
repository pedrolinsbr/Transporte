import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LancamentoCampanhaService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  //#lancamentoCampanha.buscar
  getLancamentoCampanha(lancamentoCampanha) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscar", lancamentoCampanha) };

  //#lancamentoCampanha.salvar
  addLancamentoCampanha(lancamentoCampanha) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/salvar", lancamentoCampanha) };

  //#lancamentoCampanha.atualizar
  updateLancamentoCampanha(lancamentoCampanha) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/atualizar", lancamentoCampanha) };

  //#lancamentoCampanha.excluir
  deleteLancamentoCampanha(lancamentoCampanha) {
    lancamentoCampanha = {'IDG093':lancamentoCampanha}
    return this.http.post<any>(this.url + "tp/lancamentoCampanha/excluir", lancamentoCampanha)
  }

  getTransportadorasParticipantes(lancamentoCampanha) { 
    return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscarTransportadoras", lancamentoCampanha) 
  };

  getListarMotoristas(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/listarMotoristas", obj) };

  getApontamentoExistentes() { return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscarApontamentoExistentes", null) };

  setLancamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/lancamentoMotorista", obj) };
  
  getApontamentoExistentesUser() { 
    let user = {IDS001: localStorage.getItem('ID_USER')}
    return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscarApontamentoExistentesUser", user) 
  };

  getApontamentoExistentesUserRetifica() { 
    let user = {IDS001: localStorage.getItem('ID_USER')}
    return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscarApontamentoExistentesUserRetifica", user) 
  };

  getApontamentoExistentesUserAcl() { 
    let user = {IDS001: localStorage.getItem('ID_USER')}
    return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscarApontamentoExistentesUserAcl", user) 
  };


  setLancamentoKm(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/lancamentoKmMotorista", obj) };

  setLancamentoMd(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/lancamentoMdMotorista", obj) };
  
  getAnexoLancamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/listarAnexoLancamento", obj) };

  getListaLancamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/listaLancamento", obj) };

  excluirAnexoLancamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/excluirAnexoLancamento", obj) };

  downloadAnexoLancamento(IDA004):Observable<any>{
    return this.http.post(this.url + "mo/atendimentos/downloadAnexo", IDA004,{responseType: 'blob'});
  }

  buscaObservacao(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/buscaObservacao", obj) };

  atualizaObservacao(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/atualizaObservacao", obj) };

  removerLancamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/removerLancamento", obj) };

  buscarAcoes(obj) { return this.http.post<any>(this.url + "filtro/Acoes", obj)};

  validaFechamento(obj) { return this.http.post<any>(this.url + "tp/segurancapremiada/validaFechamento", obj) };

  getUsuariosFechamento(obj) { return this.http.post<any>(this.url + "tp/lancamentoCampanha/usuariosFechamento", obj) };

  
}
