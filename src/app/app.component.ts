import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { Component, OnInit} from '@angular/core';
import { GlobalsServices } from './shared/componentesbravo/src/app/services/globals.services';
import { SessionServices } from './services/session.services';
import { TranslateService } from '@ngx-translate/core';
import { UtilServices } from './shared/componentesbravo/src/app/services/util.services';

import {
  Event as RouterEvent,
  NavigationStart,
  NavigationCancel,
  NavigationError
} from '@angular/router';


@Component({
  selector: 'app-root',
  template: `<router-outlet
  (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'
  ></router-outlet>`
})
export class AppComponent implements OnInit{
  showNav: boolean;
  loading: boolean = true;
  constructor(
    private Router: Router,
    private routeActive: ActivatedRoute,
    private GlobalsServices: GlobalsServices,
    private SessionServices: SessionServices,
    public translate: TranslateService,
    public utilServices:UtilServices

  ) {


    Router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });

    //debugger;
    translate.addLangs(['en', 'es', 'pt']);
    translate.setDefaultLang('pt');

    const browserLang: string = translate.getBrowserLang();

    translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');

    //VERIFICANDO LOGIN NO STORAGE

    if (localStorage.getItem('isLogged') == "true") {
      this.GlobalsServices.setVariavel('isLogged', localStorage.getItem('isLogged'));
    }

    //VERIFICANDO NAVBAR NO STORAGE
    if (localStorage.getItem('showNav') == "true") {
      this.GlobalsServices.setVariavel('showNav', localStorage.getItem('showNav'));
      this.showNav = this.GlobalsServices.getVariavel('showNav');
    }
  }

  ngOnInit(){
    //debugger;

    var url_atual = window.location.href;
    var hash = url_atual.split('hash=');

    if((hash.length <= 1)){
      if (!this.GlobalsServices.getVariavel('isLogged')) {
        if (window.location.pathname.substring(0, 12) != "/admin/login") {
          this.Router.navigate(['admin/login']);
        }
      }

      //bloqueando sidebar e headerbar na inicializacao
      this.Router.events.subscribe((e) => {

        if (e instanceof NavigationEnd) {
          let urlSlice = e.url.toString().substr(0, 10);

          //bloqueando not found
          if (
            urlSlice.indexOf('not-found') !== -1 ||
            urlSlice.indexOf('login') !== -1
          ) {
            this.GlobalsServices.setVariavel('showNav', false);
          } else {
            this.GlobalsServices.setVariavel('showNav', true);
          }

        }

      });
    }

  }


  // get component: Object
  // get activatedRoute: ActivatedRoute
  // get activatedRouteData


  onActivate(component) {
    // you have access to the component instance
    
  }
  onDeactivate(component) {
    // you have access to the component instance
    
  }



// Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    
    if (event instanceof NavigationStart) {
      this.loading = true;
      this.utilServices.loadGridShow();
    }
    if (event instanceof NavigationEnd) {
      setTimeout(() => { // here
        this.loading = false;
        this.utilServices.loadGridHide();
      }, 2000);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      setTimeout(() => { // here
        this.loading = false;
        this.utilServices.loadGridHide();
      }, 2000);
    }
    if (event instanceof NavigationError) {
      setTimeout(() => { // here
        this.loading = false;
        this.utilServices.loadGridHide();
      }, 2000);
    }
  }


}
