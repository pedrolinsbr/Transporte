import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalsServices } from '../globals.services';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MunicipiosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) { this.url = this.global.getApiHost() };

  getMunicipios() { return this.http.get<any>(this.url + "cidades") };

  getMunicipio(IDG003) { return this.http.get<any>(this.url + "cidade/" + IDG003) };

  getMunicipiosEstado(IdG002) { return this.http.get<any>(this.url + "cidades-estado/" + IdG002) };

  getClientesMunicipio(IdG003) { return this.http.get<any>(this.url + "cidade-clientes/" + IdG003) };

  addMunicipio(municipio) { return this.http.post<any>(this.url + "cidade", municipio) };

  updateMunicipio(municipio) { return this.http.post<any>(this.url + "cidade/" + municipio.IDG003, municipio) };

  deleteMunicipio(IDG003) { return this.http.delete<any>(this.url + "cidade/" + IDG003) };

}
