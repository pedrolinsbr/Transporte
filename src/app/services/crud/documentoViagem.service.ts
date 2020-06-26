import { Injectable } from '@angular/core';
import { GlobalsServices } from '../globals.services';

import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DocumentoViagemService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHostUrl();
  }



  //#ocorrencia.salvar
  addDocumentoViagem(documento) { return this.http.post<any>(this.url + "tp/documentoViagem/salvar", documento) };

  //Deletar documento
  deleteDocumento(documento) {
    return this.http.post<any>(this.url + "tp/documentoViagem/excluir", documento)
  }

  getDocumentoByAutor(objAutor){
    return this.http.post<any>(this.url + "tp/documentoViagem/getDocumentoByAutor", objAutor)
  }


  upload(dados) { return this.http.post<any>(this.url + "tp/documentoViagem/file", dados) };

  downloadDocumento(IDA004):Observable<any>{
    return this.http.post(this.url + "tp/documentoViagem/downloadAnexo", IDA004,{responseType: 'blob'});
  }



/*   //#ocorrencia.atualizar
  updateOcorrencia(ocorrencia) { return this.http.post<any>(this.url + "tp/ocorrencia/atualizar", ocorrencia) };


 */
}
