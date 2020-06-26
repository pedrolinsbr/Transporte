import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AgendamentoService {
  private global = new GlobalsServices();
  private url;

  public dadosCarga;  
  public dadosAceite;
  public infoReagendar;
  public objEditar;
  public dataEditar = [{year: 0, month: 0, day: 0}];
  public armazemEditar = {id: '', text: ""};
  public idProtocolo;
  public operacao = 2; //1- carga, 2- descarga, 3- consulta, 4 - reagendar, 5 - editar
  public breacrumbOp = 3; //1- carga, 2- descarga, 3- consulta, 4 - reagendar
  public mapPageGrade={horarios:false, protocolo:false, listagem: false};
  public disparar = false;
  public indice = false;

 constructor(private http: HttpClient) { this.url = this.global.getApiHost() };

 getTempoCarga(obj) { return this.http.post<any>(this.url + "hc/agendamento/tempoSlots", obj) };
 SalvarAgendamento(obj) { return this.http.post<any>(this.url + "hc/agendamento/salvar", obj) };
 SalvarReagendamento(obj) { return this.http.post<any>(this.url + "hc/agendamento/reagendar", obj) };
 dadosProtocolo(obj){return this.http.get<any>(this.url + "comprovante_agendamento/" + obj ) };
 buscarAgendamentos(obj){return this.http.post<any>(this.url + "hc/agendamento/buscar/agendamentos", obj ) };
 trocarStatus(obj){return this.http.post<any>(this.url + "hc/agendamento/status", obj ) };
 buscarMotorista(obj){return this.http.post<any>(this.url + "hc/motorista/buscar/cpf", obj ) };
 buscarMontarCarga(obj){return this.http.post<any>(this.url + "hc/agendamento/buscar/montarcarga", obj ) };
 buscarRelatorio(obj){return this.http.post<any>(this.url + "hc/agendamento/buscar/relatorio", obj ) };
 salvarMotorista(obj){return this.http.post<any>(this.url + "hc/motorista/salvar/precadastro", obj ) };
 salvarMontarCarga(obj){return this.http.post<any>(this.url + "viagem/insere", obj ) };
 salvarComentarios(obj){return this.http.post<any>(this.url + "hc/agendamento/comentarios", obj ) };
 buscarComentarios(obj){return this.http.post<any>(this.url + "hc/agendamento/buscar/comentarios", obj ) };
 upload(dados){ return this.http.post<any>(this.url+ "hc/nf/up", dados) };
 buscarNF(obj){return this.http.post<any>(this.url + "hc/agendamento/buscar/NF", obj ) };
 cancelar(obj){return this.http.post<any>(this.url + "hc/agendamento/cancelar/carga-4pl", obj ) }; //cancela 4pl
 cancelarDescarga(obj){return this.http.post<any>(this.url + "hc/agendamento/cancelar/agendamento", obj ) }; //cancela descarga
 rejeitarOferecimento(obj){return this.http.post<any>(this.url + "aceite/altera", obj ) };
 buscarIdO005(obj){return this.http.get<any>(this.url + `aceite/lista-id/${obj}` ) };
 buscarAcoes(obj){return this.http.post<any>(this.url + "filtro/Acoes", obj ) };
 mudarStFinali(obj){return this.http.post<any>(this.url + "hc/agendamento/mudar-st-finali", obj ) };
 editarAgendamento(obj){return this.http.post<any>(this.url + "hc/agendamento/editar-agendamento", obj ) };

 resetDadosAgendamento(){
 this.dadosCarga    = undefined;
 this.dadosAceite   = undefined;
 this.infoReagendar = undefined;
}

routePagGrade(page){
  this.mapPageGrade={horarios:false, protocolo:false, listagem: false};
  this.mapPageGrade[page] = true;
 }
}