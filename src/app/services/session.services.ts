/************************
COMPONENTES/PLUGINS
************************/
import { Injectable } from '@angular/core';
import { GlobalsServices } from './globals.services';
import { Http, Response, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';

/************************
PROVIDERS
************************/

@Injectable()
export class SessionServices {
    private global = new GlobalsServices();
    private url;
    private headers;
	user: any;


	constructor(
        private http: Http) {
        this.url = this.global.getApiHost();

        //this.headers = new Headers();
        //this.headers.append('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMWYwM2U5ZjYzNGE5N2M2ZWQ0ZTNiMiIsImVtYWlsIjoidmFuZXNzYXNvdXRvY0BnbWFpbC5jb20iLCJuYW1lIjoiVmFuZXNzYSBTb3V0byIsInJvbGVzIjpbXSwiaWF0IjoxNTEyMDkyMjc1fQ.tz_c4O6GenwKsm7GO9NaC6N3tT7EWjBUIfGdQGTeNvc')
    }

	/************
	GET LOGIN
	*************/
	getLogin(form) {
		this.user = { email: form.uname, password: form.password };
		return this.http.post(this.url+'auth/login', this.user).map(
			(res:Response)=>{
				
				return res.json();
			}
		);
	}

	/************
	GET LOGOUT
	*************/
	getLogout() {
		
	}


	/************************************************************************
	NEW LOGIN
	*************************************************************************/

	getLoginNew(form) {
		this.user = { dsemalog: form.uname, dssenha: form.password, dsmodulo: 'TRANSPORTATION' };
		return this.http.post(this.url+'usuario/login', this.user).map(
			(res:Response)=>{
				
				localStorage.setItem('ID_USER', res.json().IDS001);
				localStorage.setItem('IDMODULO', '7');
				localStorage.setItem('DSMODULO', 'transportation');

				localStorage.setItem('DSINTERN', (res.json().DSINTERN != 'undefined' ? res.json().DSINTERN : 'pt'));
				localStorage.setItem('DSTEMA',   (res.json().DSTEMA   != 'undefined' ? res.json().DSTEMA   : 'L'));
				localStorage.setItem('DSSIDEBA', (res.json().DSSIDEBA != 'undefined' ? res.json().DSSIDEBA : 'D'));
				localStorage.setItem('IDS001',    res.json().IDS001);

				return res.json();

			}
		);
	}

	encrypt(message) {
		var key = "6Le0DgMTAAAAANokdEEial";
		var iv = "mHGFxENnZLbienLyANoi.e";
		// Encrypt
		var ciphertext = CryptoJS.AES.encrypt(message, key, { iv: iv });
		return ciphertext.toString();
	}

	decrypt(message) {
		var key = "6Le0DgMTAAAAANokdEEial";
		var iv = "mHGFxENnZLbienLyANoi.e";
		// Decrypt
		var bytes = CryptoJS.AES.decrypt(message, key, { iv: iv });
		return bytes.toString(CryptoJS.enc.Utf8);
	}

}
