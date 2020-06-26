import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MaloteService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }

  buscaChadocs(obj){return this.http.post<any>(`${this.url}tp/validMalote/listChadocs`, obj ) };

  saveValidation(obj){ return this.http.post<any>(`${this.url}tp/validationDocs/createValidationDocs`, obj) };
}
