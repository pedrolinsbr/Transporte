import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices } from './globals.services';


@Injectable()
export class AdminLayoutService {
  
  private global = new GlobalsServices();
  private url;
  ID_USER = localStorage.getItem('ID_USER');
  
  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  getMenu(){

  	// let user = JSON.parse(localStorage.getItem('hora-certa-user'));
  	// let obj  = {ids001: user.IDS001, dsmodulo: 'hora-certa'};
    let obj  = {ids001: localStorage.getItem('ID_USER'), dsmodulo: 'transportation'};

    return this.http.post<any>(this.url + "menu/menuItens", obj)

  }

  getIndi(){

  	// let user = JSON.parse(localStorage.getItem('hora-certa-user'));
  	// let obj  = {ids001: user.IDS001, dsmodulo: 'hora-certa'};
    let obj  = {ids001: localStorage.getItem('ID_USER')};

    return this.http.post<any>(this.url + "tp/liberacaoOcorrencia/menuIndi", obj)

  }

}
