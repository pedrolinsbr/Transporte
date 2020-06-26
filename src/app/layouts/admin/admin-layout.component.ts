import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent, NgZone, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { AdminLayoutService } from '../../services/admin-layout.service';
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';

const SMALL_WIDTH_BREAKPOINT = 991;

declare var google: any;
declare var $: any;

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  currentLang = (localStorage.getItem('DSINTERN') == 'undefined' ? 'pt' : localStorage.getItem('DSINTERN'));
  options: Options;
  theme = (localStorage.getItem('DSTEMA') == 'D' ? 'dark': 'light');
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = (localStorage.getItem('DSSIDEBA') == 'undefined' ? 'push' : this.utilService.getModeStr(localStorage.getItem('DSSIDEBA')));
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;
  tamMenu = 1;
  indimenu = 0;


  @ViewChild('sidebar') sidebar;


  constructor (
    public menuItems: MenuItems,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
    private titleService: Title,
    private GlobalsServices: GlobalsServices,
    private utilService: UtilServices,
    private zone: NgZone,
    public adminService: AdminLayoutService) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(localStorage.getItem('DSINTERN'));
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
  }

  ngOnInit(): void {
    

    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;
      this.runOnRouteChange();
    });
    this.addMenu();
    // this.initMap2();
  }

  ngAfterViewInit(): void  {
    setTimeout(_ => this.runOnRouteChange());
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver() || this.router.url === '/maps/fullscreen') {
      this.isOpened = false;
    }

    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.options = activeRoute.snapshot.data;
    });

    if (this.options) {
      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    }
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( 'Evolog - ETMS | ' + newTitle );
  }

  toogleSidebar(): void {
    if (this._mode !== 'dock') {
      this.isOpened = !this.isOpened;
    }
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.modalService.open(search, { windowClass: 'search', backdrop: false });
  }

  addMenu(): void {

    this.adminService.getMenu()
      .subscribe(
        data =>{
            this.menuItems.add(data);
            this.tamMenu = this.menuItems.tamMenu();
        },
      err => {
        alert("Error");
      });

  

      this.adminService.getIndi()
      .subscribe(
        data =>{
            this.indimenu = data.QTD;
        },
      err => {
        alert("Error");
      });



  }
  logout(){
    this.menuItems.clear();
    localStorage.setItem('isLogged', 'false');
    localStorage.setItem('showNav', 'false');
    this.GlobalsServices.setVariavel('isLogged', false);
    this.GlobalsServices.setVariavel('showNav', false);
    localStorage.setItem('user',null);
    localStorage.setItem('token', null);
    //this.router.navigate(["/home"]);
    location.href = "/#/admin/login";
  }

  attachSecretMessage(marker, secretMessage) {
    var infowindow = new google.maps.InfoWindow({
      content: secretMessage
    });
    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
  }  

  initMap2() {
    var service = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      //center: origin,
      //zoom: 5,
      zoomControl: true,
      scaleControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true
    });

    // Caminho das imagens
    var caminhao = document.location.origin + '/assets/images/maps/caminhao.png';
    var cliente = document.location.origin + '/assets/images/maps/cliente.png';
    var empresa = document.location.origin + '/assets/images/maps/empresa.png';

    // list of points
    var stations = [
        {lat: 48.9812840, lng: 21.2171920, name: 'Parada 1', icon: empresa},
        {lat: 48.9812840, lng: 21.2176398, name: 'Parada 2', icon: caminhao},
        {lat: 48.9812840, lng: 21.2209088, name: 'Parada 3', icon: cliente}/* ,
        {lat: 48.9861461, lng: 21.2261563, name: 'Parada 4', icon: cliente},
        {lat: 48.9874682, lng: 21.2294855, name: 'Parada 5', icon: cliente},
        {lat: 48.9909244, lng: 21.2295512, name: 'Parada 6', icon: cliente},
        {lat: 48.9928871, lng: 21.2292352, name: 'Parada 7', icon: cliente},
        {lat: 48.9921334, lng: 21.2246742, name: 'Parada 8', icon: cliente},
        {lat: 48.9943196, lng: 21.2234792, name: 'Parada 9', icon: cliente},
        {lat: 48.9966345, lng: 21.2221262, name: 'Parada 10', icon: cliente},
        {lat: 48.9981191, lng: 21.2271386, name: 'Parada 11', icon: cliente},
        {lat: 49.0009168, lng: 21.2359527, name: 'Parada 12', icon: cliente},
        {lat: 49.0017950, lng: 21.2392890, name: 'Parada 13', icon: cliente},
        {lat: 48.9991912, lng: 21.2398272, name: 'Parada 14', icon: cliente},
        {lat: 48.9959850, lng: 21.2418410, name: 'Parada 15', icon: cliente},
        {lat: 48.9931772, lng: 21.2453901, name: 'Parada 16', icon: cliente},
        {lat: 48.9963512, lng: 21.2525850, name: 'Parada 17', icon: cliente},
        {lat: 48.9985134, lng: 21.2508423, name: 'Parada 18', icon: cliente},
        {lat: 49.0085000, lng: 21.2508000, name: 'Parada 19', icon: cliente},
        {lat: 49.0093000, lng: 21.2528000, name: 'Parada 20', icon: cliente},
        {lat: 49.0103000, lng: 21.2560000, name: 'Parada 21', icon: cliente},
        {lat: 49.0112000, lng: 21.2590000, name: 'Parada 22', icon: cliente},
        {lat: 49.0124000, lng: 21.2620000, name: 'Parada 23', icon: cliente},
        {lat: 49.0135000, lng: 21.2650000, name: 'Parada 24', icon: cliente},
        {lat: 49.0149000, lng: 21.2680000, name: 'Parada 25', icon: cliente},
        {lat: 49.0171000, lng: 21.2710000, name: 'Parada 26', icon: cliente},
        {lat: 49.0198000, lng: 21.2740000, name: 'Parada 27', icon: cliente},
        {lat: 49.0305000, lng: 21.3000000, name: 'Parada 28', icon: cliente}, */
        // ... quantas outras estações você precisar
    ];

    // Zoom e mapa central automaticamente por estações (cada estação estará na área do mapa visível)
    var lngs = stations.map(function(station) { return station.lng; });
    var lats = stations.map(function(station) { return station.lat; });
    map.fitBounds({
        west: Math.min.apply(null, lngs),
        east: Math.max.apply(null, lngs),
        north: Math.min.apply(null, lats),
        south: Math.max.apply(null, lats),
    });

    // Mostrar estações no mapa como marcadores
    for (var i = 0; i < stations.length; i++) {
      var marker = new google.maps.Marker({
        position: stations[i],
        map: map,
        title: stations[i].name,
        icon: stations[i].icon
      });
      // Mostra o infowindow automaticamente 
      this.attachSecretMessage(marker, stations[i].name);
    }
    //debugger;
    // Divide a rota para várias partes porque o limite máximo de estações é de 25 (23 pontos de referência + 1 origem + 1 destino)
    for (var i = 0, parts = [], max = 25 - 1; i < stations.length; i = i + max)
        parts.push(stations.slice(i, i + max + 1));

    // Chamada de serviço para processar os resultados do serviço
    var service_callback = (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        //debugger;
        
        let bloco = "";
        for (var x = 0; x < response.routes[0].legs.length; x++) {
          if (x == 0) {
            for (var i = 0; i < parts.length; i++) {
              if ((response.request.origin.location.lng() + "").substring(0, parts[i][0].lng.toString().length) == parts[i][0].lng.toString() &&
                (response.request.origin.location.lat() + "").substring(0, parts[i][0].lat.toString().length) == parts[i][0].lat.toString()) {
                console.log("Bloco: " + i);
                bloco = i.toString();
              }
            }
          }

          let dsdisnta = response.routes[0].legs[x].distance.value / 1000; // Metro to KM
          let horas = this.secondsToTime(response.routes[0].legs[x].duration.value);
          let tpestima = horas.h + ':' + horas.m + ':' + horas.s;
          console.log("Bloco: " + bloco + ' Parada ' + (x+1) + ' - Distância: ' + dsdisnta + ' Duração: ' + tpestima);
        }

        var renderer = new google.maps.DirectionsRenderer;
        renderer.setMap(map);
        renderer.setOptions({
          suppressMarkers: true,
          preserveViewport: true,
          polylineOptions:{
            strokeColor:"#0275d8", // Cor da linha
            strokeOpacity: 0.7, // Opacidade da cor
            strokeWeight: 3 // Grossura da linha
          }
        });
        renderer.setDirections(response);
      } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
        window.alert('Dados de localização não encontrados.');
      }else if (status = google.maps.DirectionsStatus.NOT_FOUND) {
        window.alert('NOT_FOUND');
      } else if (status = google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED) {
        window.alert('MAX_WAYPOINTS_EXCEEDED');
      } else if (status = google.maps.DirectionsStatus.INVALID_REQUEST) {
        window.alert('INVALID_REQUEST');
      } else if (status = google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
        window.alert('OVER_QUERY_LIMIT');
      } else if (status = google.maps.DirectionsStatus.REQUEST_DENIED) {
        window.alert('REQUEST_DENIED');
      } else {
        window.alert('Ocorreu um erro ao carregar o mapa. Por favor tente novamente.');
      }
      
    };
    
    // Enviar solicitações ao serviço para obter rota (para contagens de estações <= 25, somente uma solicitação será enviada)
    for (var i = 0; i < parts.length; i++) {
      // Waypoints não incluem primeira estação (origem) e última estação (destino)
      var waypoints = [];
      for (var j = 1; j < parts[i].length - 1; j++) {
        // stopover é um booleano que indica que o waypoint é uma parada na rota, que tem o efeito de dividir a rota em duas rotas.
        waypoints.push({ location: parts[i][j], stopover: true });
      }
      // Service options
      var service_options = {
          origin: parts[i][0],
          destination: parts[i][parts[i].length - 1],
          waypoints: waypoints,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
          unitSystem: google.maps.DirectionsUnitSystem.METRIC,
          optimizeWaypoints: true,
          provideRouteAlternatives: false
      };
      // Send request
      service.route(service_options, service_callback);
      
    }
  }

  secondsToTime(secs: number) {
    secs = Math.round(secs);
    var hours = Math.floor(secs / (60 * 60));

    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    
    var obj = {
      "h": (hours.toString().length == 1 ? '0'+hours:hours),
      "m": (minutes.toString().length == 1 ? '0'+minutes:minutes),
      "s": (seconds.toString().length == 1 ? '0'+seconds:seconds)
    };
    return obj;
  }

}
