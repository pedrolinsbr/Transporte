import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionServices } from '../../services/session.services';
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';
import { ErrorServices } from '../../services/error.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  res: any;
  public form: FormGroup;
  public loading = true;
  public hash: String = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionServices: SessionServices,
    private GlobalsServices: GlobalsServices,
    private toastr: ToastrService,
    private errorServices: ErrorServices,
    public translate: TranslateService,
    public location: Location,
    private activatedRoute: ActivatedRoute,
  ) {

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.hash = params['hash'];
      }
    );
  }

  ngOnInit() {
    //localStorage.clear();
      var url_atual = window.location.href;
      var url_https = url_atual.slice(0, 5);
      console.log(url_atual, url_https);
      if (url_https != 'https' && 
          url_atual.indexOf("localhost") == -1 && 
          url_atual.indexOf("dev.") == -1 && 
          url_atual.indexOf("qas.") == -1) {

          location.replace("https://etms.evolog.com.br/#/");
        
      }

    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])], password: [null, Validators.compose([Validators.required])]
    });

    if (this.hash != undefined) {
      this.hash = JSON.parse(this.sessionServices.decrypt(this.hash));
      let dataAtual = (new Date().getTime());
      this.hash['time'] = new Date(parseInt(this.hash['time']));
      if ((new Date().getTime()) <= this.hash['time']) { // :TODO Mudar aqui quando for produção
        this.login(this.hash);
      } else {
        if (window.location.hostname == "localhost") {
          this.loading = false;
        } else {
          location.href = "http://www.evolog.com.br";
        }
      }
    } else {
      this.loading = false;
    }
  }

  onSubmit() {
    this.login(undefined);
  }

  login(formValue) {
    if (formValue == undefined) {
      formValue = this.form.value;
    }
    this.sessionServices.getLoginNew(formValue).subscribe(
      (data) => {
        if(data.LIBERADO){

          var modulo = "Transportation";
          if(data.SNADMIN == 1){
            modulo = undefined;
          }
          let userLogin = {NMUSUARI: data.NMUSUARI, SNADMIN: data.SNADMIN, DSEMALOG: data.DSEMALOG, IDS001: data.IDS001, DSMODULO: modulo, TOKEN: data.TOKEN}

          if(!data.MODULO && data.SNADMIN == 0){
            //Permissão negada
            this.toastr.error(this.errorServices.showError(1003));
            return false;
          }
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('showNav', 'true');
          this.GlobalsServices.setVariavel('isLogged', true);
          this.GlobalsServices.setVariavel('showNav', true);
          localStorage.setItem('user',JSON.stringify(userLogin));
          localStorage.setItem('token', userLogin.TOKEN);
          //this.router.navigate(["/home"]);
          location.href = "/#/";
        } else {
          this.toastr.error(this.errorServices.showError(1001));
          return false;
        }
        return data;
      },
      (err) => {
        this.errorServices.alertError(err);
        return err;
      }
    );
  }

}
