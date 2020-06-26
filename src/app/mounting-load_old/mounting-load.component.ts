// #### ANGULAR
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import * as $ from 'jquery';
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';

// #### SERVICE
import { CargaService    } from './../services/geral/carga.service';
import { UtilServices    } from './../shared/componentesbravo/src/app/services/util.services';
import { DragulaService  } from 'ng2-dragula';
import { ToastrService   } from 'ngx-toastr';
import { GlobalsServices } from '../services/globals.services';

// #### COMPONENTES
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

declare var google: any;

@Component({
  selector: 'app-mounting-load',
  templateUrl: './mounting-load.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mounting-load.component.scss']
})
export class MountingLoadComponent implements OnInit {
  private global = new GlobalsServices();

  //##### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs : any;
  @ViewChild('visaoUm')     visaoUm     : any;
  @ViewChild('visaoDois')   visaoDois   : any;
  @ViewChild('visaoTres')   visaoTres   : any;
  @ViewChild('gridCarga')   gridCarga   : any;
  @ViewChild('modalSimularRota') modalSimularRota: any;
  @ViewChild('modalConfirmarCarga') modalConfirmarCarga: any;
  @ViewChild('modalAtribuirTransportadora') modalAtribuirTransportadora: any;
  @ViewChild('modalOcorrencia') modalOcorrencia: any;
  @ViewChild('modalConfirmaDeleteCtrc') modalConfirmaDeleteCtrc: any;
  @ViewChild('modalVeiculo') modalVeiculo: any;
  @ViewChild('modalMotorista') modalMotorista: any;
  @ViewChild('indicador') indicador: any;

  //##### FORMS
  objFormFilter  : FormGroup;
  objFormCarga : FormGroup;
  objFormParametrosAux: FormGroup;


  //##### STRING
  url            = this.global.getApiHost();
  titleCard      : any; //
  nameFuncDetail = 'detalhar';  // NOME DA FUNÇÃO BOTÃO DETALHAR
  nameFuncBack   = 'detalhar';  // NOME DA FUNÇÃO BOTÃO VOLTAR
  remetrans      :boolean = true ;


  //##### ARRAYS//OBJECTS
  arBreadcrumbsLocal = [];
  arGridCarga        = [];
  arIdsIDG043        = [];
  arIdsCDDELIVE      = [];
  arIdsVRCAMPO       = [];
  arIdsIDG051        = [];
  arIdsNRNOTA        = [];
  arIdsG0769         = [];
  arIdsG07610        = [];
  linhas             = [];
  arRotas            = [];
  arDistRotas        = [];

  indicadores = {
    url: this.url + "tp/montagemCarga/indicadores/null",
    cardsNum: [0, 1, 2]
  };

  indicadores4pl = {
    url: this.url + "tp/montagemCarga/indicadores4pl/null",
    cardsNum: [0, 1, 2]
  };


  urlIndicadores = this.url + "tp/montagemCarga/indicadores/";

  urlIndicadores4pl = this.url + "tp/montagemCarga/indicadores4pl/";

  totalizador  = {qtctrc:0, qtnfe:0, psbruto:0, vrmercad:0};
  totalSeleci  = {qtctrc:0, qtnfe:0, psbruto:0, vrmercad:0};
  lsDocumentos = {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}};
  objfunction  = {visaoUm:false, visaoDois:false, visaoTres:false};
  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };
  objProgress = {
    type: 'success',
    value: 75
  };
  objProgressICC = {
    type: 'success',
    value: 75
  };
  objValidaPerformace = {
    ok: 0,
    nok: 0,
    total: 0
  };

  objValidaPerformaceICC = {
    pesoDist: 0,
    distTotal: 0
  };


  //##### INT
  validOptionsView = 'rota';
  controlViewTable = true;
  controlView      = 0;
  indexGridCarga   : any;

  //##### BOOLEAN
  collapsedFilter   = true;
  validRemoveTransp : boolean;
  showSettings      = false;
  snDelivery        = 1 ;



  qtdNf   = 0;
  qtdCtrc = 0;
  distTotal = 0;
  pesoDist = 0;
  resultICC = 0;
  //nrTravaCallBack = 0;
  // totDelivery = 0;
  // totCtrc = 0;

  objSaveCarga: any;
  objValidaCarga = {
    idg005   : 1, // restriçao do cliente
    idg030   : 1, // Tipo Veiculo
    idg031   : 1, // restriçao datas
    idg032   : 1, // restriçao datas
    pcocupac : 1, // restrição por ocupação
    psbruto  : 1, // Restrição Peso total da carga
    vrmercad : 1,  // restrição apolice
    aledtent : 1,
    tpmodcar : 1
  };

  /*
  /////# VISÃO
  ////////////////////////////////////////////////
  1 - ROTA
  2 - CIDADE
  3 - CTRC

  //# NÃO É UMA VISÃO
  4 - CARGA

  0 - FILTROS
  1 - FILTRADO
  2 - DETAHLES TOMADOR
  3 - DETAHLES ROTA
  4 - DETAHLES CIDADE
  5 - DETAHLES CTRC
  6 - CARGA

  ////////////////////////////////////////////////
  */

  isCTRC = true;
  isNota = true;
  isDelivery = true;
  carregando = false;
  detalhando = false;
  snCar4pl = 0;
  qtParadas = 0;
  qtParadasAtual = 0;
  qtParadasAtual2 = 0;
  isVerifica4pl   = null;
  //qtParadasAuxiliar = 0;
  //qtParadasAuxiliar2 = 0;
  //snProximaEtapa = 0;

  constructor(
    private modalService   : NgbModal,
    private formBuilder    : FormBuilder,
    public  cargaService   : CargaService,
    private dragulaService : DragulaService,
    private modal          : ModalComponent,
    public  toastr         : ToastrService,
    public  translate      : TranslateService,
    public  utils          : UtilServices,
    private grid           : DatagridComponent
  ) {

    const browserLang: string = translate.getBrowserLang();
    //translate.use(localStorage.getItem('DSINTERN'));
    translate.use(localStorage.getItem('DSINTERN'));

    dragulaService.dropModel.subscribe((value) => {
      this.objFormCarga.controls['IDG003OR'].setValue({id: this.arGridCarga[0].IDG003RE, text: this.arGridCarga[0].NMCIDARE + ' - '+ this.arGridCarga[0].CDESTARE});
      this.objFormCarga.controls['IDG003DE'].setValue({id: this.arGridCarga[this.arGridCarga.length - 1].IDG003DE, text: this.arGridCarga[this.arGridCarga.length - 1].NMCIDADE + ' - '+ this.arGridCarga[this.arGridCarga.length - 1].CDESTADE});
      if(!this.detalhando){
        for(let i in this.linhas){
          this.linhas[i] = false;
        }
      }
      //console.log("Entrei 1:: ",value);
    });

    this.dragulaService.drop.subscribe(value => {
      //console.log("Entrei 2:: ",value);
    });

    this.objFormParametrosAux = formBuilder.group({

      HRPARADA : [45],   //# MINUTOS A CONSIDERAR EM CADA PARADA PARA CALCULO DE DISTANCIA
      HRTOLDIS : [5],    //# MINUTOS A CONSIDERAR POR TONELADA EM CADA PARADA PARA CÁLCULO DE DISTÂNCIA
      KMCARREG : [55],   //# KM/H A CONSIDERAR NO CÁLCULO DE DISTÂNCIA PARA VEÍCULOS CARREGADOS
      KMDESCAR : [60],   //# KM/H A CONSIDERAR NO CÁLCULO DE DISTÂNCIA PARA VEÍCULOS DESCARREGADOS
      HRMAXENT : [18],   //# HORÁRIO MÁXIMO PERMITIDO PARA ENTREGA
      HRMINENT : [8],    //# ENTREGAS PERMITIDA SOMENTE APÓS AS X

      CDPGRBRA : [8],    //# CÓDIGO PGR BRAVO

      VRAPOESC : [1500],  //# VALOR APÓLICE BRAVO COM ESCOLTA
      VRAPONOR : [2000],  //# VALOR APÓLICE BRAVO SEM ESCOLTA
      VRCARESC : [],      //# VALOR MÁXIMO CARGA COM ESCOLTA
      VRCARNOR : [],      //# VALOR MÁXIMO CARGA SEM ESCOLTA
      SNMOBILE : [],      //# SE A CARGA VAI PARA O APP
      TPTRANSP : []       //# TIPO DE TRANSPORTE
    });

    this.objFormFilter = formBuilder.group({
      IDG024            : [[], [Validators.required]], // ID TRANSPORTADORA
      TPTRANSP          : [[], [Validators.required]],
      IDG002            : [], // ID ESTADO
      IDG003            : [], // ID CIDADE
      IDT001            : [], // ID ROTAS
      G051_IDG005DE     : [], // DESTINATÁRIO
      G051_IDG005RE     : [], // REMETENTE
      G051_IDG005C0     : [], // TOMADOR
      G051_IDG005DEAUX  : [], // DESTINATÁRIO
      G051_IDG005REAUX  : [], // REMETENTE
      G051_IDG005C0AUX  : [], // TOMADOR
      TPDOCUME          : [[], [Validators.required]],
      IDG051            : [], // ID CTRC
      NRNOTA            : [], // NRNOTA
      IDG043            : [], // ID DELIVERY
      CDDELIVE          : [], // CD DELIVERY

      VRCAMPO           : [], 
      G0769             : [], 
      G07610            : [], 
      SNVIRA            : [],
      SNPRIORI          : [],

      DTENTCON          : [],
      NOTLIBER          : [],
      lsDocumentos      : [],
      CALENDARIO        : [],
      IDT005            : ['', Validators.required],
      ARCALEND          :[[]]

    });

    this.objFormCarga = formBuilder.group({
      // CAMPOS VALIDOS
      // IDG002       : ['', Validators.required],
      IDG003OR     : ['', Validators.required], // CIDADE ORIGEM
      IDG003DE     : ['', Validators.required], // CIDADE DESTINO
      DSCARGA      : [],  // DESCRIÇÀO CARGA
      PSCARGA      : [],  // PESO CARGA
      VRCARGA      : [],  // VAOR CARGA
      TPCARGA      : ['', Validators.required], // TIPO CARGA
      QTDISPER     : [],  // DISTÂNCIA CARGA
      SNCARPAR     : ['', Validators.required], // FTL/LTL
      IDG031M1     : [],  // MOTORISTA 1
      IDG031M2     : [],  // MOTORISTA 2
      IDG031M3     : [],  // MOTORISTA 3
      IDG032V1     : [],  // VEICULO 1
      IDG032V2     : [],  // VEICULO 2
      IDG032V3     : [],  // VEICULO 3
      IDG024       : [],  // TRANSPORTADORA
      IDG024_CARGA : [],  // TRANSPORTADORA CARGA
      SNESCOLT     : [[], [Validators.required]],  // COM ESCOLTA?
      ALTIDG024    : [],  // ALTERAR TRANSPORTADORA GRID
      STCADAST     : [],  // SITUAÇÀO DE CADASTRO
      SIMNAOOFERECE: [],  // CONTROLE FORMULARIO
      IDG030       : [[], [Validators.required]],  // TIPO DE VEICULO
      IDG028       : [[], [Validators.required]],  // ARMAZÉM
      IDG034       : [],  // FORNECEDOR
      VRPERCAR     : [],  // VALOR PERFORMACE DA CARGA
      VRICCCAR     : [],  // VALOR ICC DA CARGA
      DTPRESAI     : ['', Validators.required], // DATA PREVISÃO DE SAÍDA
      DTPRESAIH    : ['', Validators.required], // DATA PREVISÃO DE SAÍDA - HORA
      SNMOBILE     : ['', Validators.required],
      TPTRANSP     : ['', Validators.required],
      DTCOLETA     : ['', Validators.required], // DATA COLETA
      QTDISBAS     : ['']
    });


   }

  ngOnInit() {
    // console.log('ngOnInit');

    // console.log(this.objFormFilter);
    this.titleCard = "Visão Por Rota";
    this.nameFuncDetail = 'detalharCidade';
    // this.objFormFilter.controls['IDG024'].setValue(
    //     {text: "EMPRESA 32",
    //     id: 32,
    //     ietransp: "7019582870070"});
    // this.controlView = 6;
    this.totalizador = {qtctrc:0, qtnfe:0, psbruto:0, vrmercad:0};
    this.objFormCarga.controls['SIMNAOOFERECE'].setValue('I');
    this.objFormFilter.controls['TPDOCUME'].setValue({id: 0 , text: 'Todos'});
    this.objFormFilter.controls['NOTLIBER'].setValue({id: 1 , text: 'Sim'});
    //this.objFormFilter.controls['IDT005'].setValue({id: 1 , text: 'BRAVO 3PL'});

    //this.controlView = 2;
    //console.log("Quem és tú? ::: ", this.objFormCarga.controls['SIMNAOOFERECE'].value);
    //this.openCarga();
    this.validaMontarCarga4PL();

    // this.objFormFilter.controls['IDG024'].setValue(
    //     {text: "EMPRESA 32",
    //     id: 6,
    //     ietransp: "7019582870070"});

    //     this.objFormFilter.controls['TPTRANSP'].setValue(
    //       [

    //         {id: "V", text: "Venda"},
    //         {id: "T", text: "Transferência"},
    //         {id: "D", text: "Devolução"},
    //         {id: "C", text: "Complemento"},
    //         {id: "I", text: "Industrialização"},
    //         {id: "G", text: "Retorno AG"},
    //         {id: "O", text: "Outros"}

    //       ]);

    //       this.objFormFilter.controls['IDT005'].setValue({text: "SYNGENTA 4PL [34]", id: 34, dscluste: "SYNGENTA 4PL"});

          

  }

  getParametros(obj){
    this.cargaService.getParametros(obj).subscribe(
      data=>{
        // console.log("GETPARAMETROS ::: ", data)
        if(data.data.length == 0){
          this.toastr.warning("Parâmetros Gerais de carga não encontrados.", "Alerta")
        }else{
          this.objFormParametrosAux.controls['HRPARADA'].setValue(data.data[0].HRPARADA);
          this.objFormParametrosAux.controls['HRTOLDIS'].setValue(data.data[0].HRTOLDIS);
          this.objFormParametrosAux.controls['KMCARREG'].setValue(data.data[0].KMCARREG);
          this.objFormParametrosAux.controls['KMDESCAR'].setValue(data.data[0].KMDESCAR);
          this.objFormParametrosAux.controls['HRMAXENT'].setValue(data.data[0].HRMAXENT);
          this.objFormParametrosAux.controls['HRMINENT'].setValue(data.data[0].HRMINENT);
          this.objFormParametrosAux.controls['CDPGRBRA'].setValue(data.data[0].CDPGRBRA);
          this.objFormParametrosAux.controls['VRAPOESC'].setValue(data.data[0].VRAPOESC);
          this.objFormParametrosAux.controls['VRAPONOR'].setValue(data.data[0].VRAPONOR);
          this.objFormParametrosAux.controls['VRCARESC'].setValue(data.data[0].VRCARESC);
          this.objFormParametrosAux.controls['VRCARNOR'].setValue(data.data[0].VRCARNOR);
          this.objFormParametrosAux.controls['SNMOBILE'].setValue(data.data[0].SNMOBILE);
          this.objFormParametrosAux.controls['TPTRANSP'].setValue(data.data[0].TPTRANSP);
        }
      }
    );

    //Atribui o armazem de coleta associado a uma transportadora
    this.cargaService.getArmazemColeta(obj).subscribe(
      data=>{
        // console.log("GETPARAMETROSARMAZEMCOLETA ::: ", data);
        if(data.data.length == 0){
          this.objFormCarga.controls['IDG028'].setValue(null);
          this.toastr.warning("Armazém de coleta não encontrado.", "Alerta");
        }else{
          if(data.data.length == 1){
            this.objFormCarga.controls['IDG028'].setValue({id:data.data[0].ID,text:data.data[0].TEXT});
          }else{
            this.objFormCarga.controls['IDG028'].setValue(null);
            // console.log('+1 armazem');
          }
        }
      }
    );
    // var that = this;
    // $.ajax({
    //   method: 'POST',
    //   url: this.url + "tp/parametrosGeraisCarga/listar",
    // }).done(function(data){
    //
    //
    // }).fail(function(err){
    //
    // });
  }

// Sugere um tipo de veiculo baseado no peso bruto da carga
  getPesoCarga(obj){
    this.cargaService.getCapacidadePeso(obj).subscribe(
      data=>{
        if(data.data.length > 0){
          this.objFormCarga.controls['IDG030'].setValue({id: data.data[0].ID,
                                                         text: data.data[0].TEXT,
                                                         qtcappes: data.data[0].QTCAPPES,
                                                         pcpesmin: data.data[0].PCPESMIN,
                                                         idg030: data.data[0].IDG030,
                                                         pcmin4pl: data.data[0].PCMIN4PL
                                                        });



        }else{
          this.objFormCarga.controls['IDG030'].setValue(null);
        }
         
      }
    );
  }

  // setTipoTransp(obj){
  //   this.cargaService.setTipoTransporte(obj).subscribe(
  //     data=>{
  //       console.log("Informações do setTipoTransp",data);
  //         if(data.data[0].id43){
  //           this.objFormCarga.controls['TPTRANSP'].setValue({id:data.data[0].ID43,text:data.data[0].TEXT43});

  //         }else if(data.data[0].id51){
  //           this.objFormCarga.controls['TPTRANSP'].setValue({id:data.data[0].ID51,text:data.data[0].TEXT51});

  //         }
  //     }
  //   );
  // }
  //############  START FUNCTIONS OF BREADCRUMBS  ######################

  set(id, name, functionName,parameter, icon){//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    console.log('inicio do show');
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    console.log('inicio laço show');
    for(let item of this.arBreadcrumbsLocal){
      if(item.id == data.id || item.name == name){
        valid = false;
      }
    }
    console.log('fim laço show');
    if(valid){
      this.arBreadcrumbsLocal.push(data);
    }
    console.log('fim do show');
  }

  goHome(event = null){ //IR PARA TELA INICIAL
    this.arBreadcrumbsLocal = [];
    this.nameFuncDetail = 'detalharCidade';
    this.controlViewTable = true;
    this.filtrar(true);
  }

  clearNext(item){ //LIMPAR PROXIMOS PASSOS
      let ar = [];
      for(let itemFor of this.arBreadcrumbsLocal){
        ar.push(itemFor);
        if(item.id == itemFor.id){
          break;
        }
      }
    this.arBreadcrumbsLocal = ar;
  }
  //############  END FUNCTIONS OF THE BREADCRUMBS  ######################

  filtrar(flag = true){
    // console.log("flag::::", flag);
    if(flag){
      this.objFormFilter.controls['lsDocumentos'].setValue({ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}});
    }
    //this.objFormFilter.controls['lsDocumentos'].setValue( {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}});

    if(this.validaFormularioValido(this.objFormFilter)){
      // console.log("::: ", this.validOptionsView);
      this.getParametros({'parameter[IDG024]': this.objFormFilter.value.IDG024.id});

      let idsG043    = '';
      let idsDELIVE  = '';
      let idsG051    = '';
      let idsNRNOTA  = '';
      let idsVRCAMPO = '';
      let idsG0769   = '';
      let idsG07610  = '';

    //  debugger;
      if(this.arIdsIDG051.length > 0 ){
        for(let i of this.arIdsIDG051){
          idsG051 += i.name+', ';
          //idsG051.push(i.name);
        }
        idsG051 = idsG051.substring(0, (idsG051.length - 2));
        this.objFormFilter.controls['IDG051'].setValue(idsG051);
      }else{
        this.objFormFilter.controls['IDG051'].setValue(null);
      }

      if(this.arIdsNRNOTA.length > 0 ){
        for(let i of this.arIdsNRNOTA){
          idsNRNOTA += i.name+', ';
          //idsNRNOTA.push(i.name);
        }
        idsNRNOTA = idsNRNOTA.substring(0, (idsNRNOTA.length - 2));
        this.objFormFilter.controls['NRNOTA'].setValue(idsNRNOTA);
      }else{
        this.objFormFilter.controls['NRNOTA'].setValue(null);
      }


      if(this.arIdsIDG043.length > 0 ){
        for(let i of this.arIdsIDG043){
          idsG043 += i.name+', ';
          //idsG043.push(i.name);
        }
        idsG043 = idsG043.substring(0, (idsG043.length - 2));
        this.objFormFilter.controls['IDG043'].setValue(idsG043);
      }else{
        this.objFormFilter.controls['IDG043'].setValue(null);
      }


      if(this.arIdsCDDELIVE.length > 0 ){
        for(let i of this.arIdsCDDELIVE){
          idsDELIVE += "'"+i.name+"' , ";
          //idsDELIVE.push(i.name);
        }
        idsDELIVE = idsDELIVE.substring(0, (idsDELIVE.length - 2));
        this.objFormFilter.controls['CDDELIVE'].setValue(idsDELIVE);
      }else{
        this.objFormFilter.controls['CDDELIVE'].setValue(null);
      }


      if(this.arIdsVRCAMPO.length > 0 ){
        for(let i of this.arIdsVRCAMPO){
          idsVRCAMPO += "'"+i.name+"' , ";
          //idsVRCAMPO.push(i.name);
        }
        idsVRCAMPO = idsVRCAMPO.substring(0, (idsVRCAMPO.length - 2));
        this.objFormFilter.controls['VRCAMPO'].setValue(idsVRCAMPO);
      }else{
        this.objFormFilter.controls['VRCAMPO'].setValue(null);
      }


      if(this.arIdsG0769.length > 0 ){
        for(let i of this.arIdsG0769){
          idsG0769 += "'"+i.name+"' , ";
          //idsG0769.push(i.name);
        }
        idsG0769 = idsG0769.substring(0, (idsG0769.length - 2));
        this.objFormFilter.controls['G0769'].setValue(idsG0769);
      }else{
        this.objFormFilter.controls['G0769'].setValue(null);
      }


      if(this.arIdsG07610.length > 0 ){
        for(let i of this.arIdsG07610){
          idsG07610 += "'"+i.name+"' , ";
          //idsG07610.push(i.name);
        }
        idsG07610 = idsG07610.substring(0, (idsG07610.length - 2));
        this.objFormFilter.controls['G07610'].setValue(idsG07610);
      }else{
        this.objFormFilter.controls['G07610'].setValue(null);
      }


      if(this.objFormFilter.controls['G051_IDG005DEAUX'].value){
        if(this.objFormFilter.controls['G051_IDG005DEAUX'].value.length > 0){
          let id = [];
          for(let i=0;this.objFormFilter.controls['G051_IDG005DEAUX'].value.length > i; i++){
            id.push(this.objFormFilter.controls['G051_IDG005DEAUX'].value[i].id);
          }
          let strId = id.join(',');
          this.objFormFilter.controls['G051_IDG005DE'].setValue(strId);
          //console.log("Reggae :: ", this.objFormFilter.controls['G051_IDG005DE'].value);
        }else{
          this.objFormFilter.controls['G051_IDG005DE'].setValue(null);
        }
      }else{
          this.objFormFilter.controls['G051_IDG005DE'].setValue(null);
      }

      if(this.objFormFilter.controls['G051_IDG005REAUX'].value){
        if(this.objFormFilter.controls['G051_IDG005REAUX'].value.length > 0){
          let id = [];
          for(let i=0;this.objFormFilter.controls['G051_IDG005REAUX'].value.length > i; i++){
            id.push(this.objFormFilter.controls['G051_IDG005REAUX'].value[i].id);
          }
          let strId = id.join(',');
          this.objFormFilter.controls['G051_IDG005RE'].setValue(strId);
          //console.log("Reggae :: ", this.objFormFilter.controls['G051_IDG005RE'].value);
        }else{
          this.objFormFilter.controls['G051_IDG005RE'].setValue(null);
        }
      }else{
          this.objFormFilter.controls['G051_IDG005RE'].setValue(null);
      }

      if(this.objFormFilter.controls['G051_IDG005C0AUX'].value){
        if(this.objFormFilter.controls['G051_IDG005C0AUX'].value.length > 0){
          let id = [];
          for(let i=0;this.objFormFilter.controls['G051_IDG005C0AUX'].value.length > i; i++){
            id.push(this.objFormFilter.controls['G051_IDG005C0AUX'].value[i].id);
          }
          let strId = id.join(',');
          this.objFormFilter.controls['G051_IDG005C0'].setValue(strId);
        //  console.log("Reggae :: ", this.objFormFilter.controls['G051_IDG005C0'].value);
        }else{
          this.objFormFilter.controls['G051_IDG005C0'].setValue(null);
        }
      }else{
          this.objFormFilter.controls['G051_IDG005C0'].setValue(null);
      }

      this.showSettings = false;
      // console.log(this.objFormFilter.value);
      
      if(this.snCar4pl == 1){
        this.indicadores.url = this.urlIndicadores4pl    + this.objFormFilter.controls['IDG024'].value.id;
        this.indicadores4pl.url = this.urlIndicadores4pl + this.objFormFilter.controls['IDG024'].value.id;
      }else{
        this.indicadores.url = this.urlIndicadores       + this.objFormFilter.controls['IDG024'].value.id;
        this.indicadores4pl.url = this.urlIndicadores4pl + this.objFormFilter.controls['IDG024'].value.id;
      }

      //this.indicadores.url = this.urlIndicadores + this.objFormFilter.controls['IDG024'].value.id;
      // console.log('URL', this.indicadores);
      // console.log('INDICADOR:: ', this.indicador);
      this.indicador.getDados();

      switch(this.validOptionsView){
        case 'rota':
          this.objfunction["visaoUm"] = false;
          this.detalharRota();
          break;
        case 'cidade':
          this.objfunction["visaoDois"] = false;
          this.detalharCidade()
          break;
        case 'CTRC':
          this.objfunction["visaoTres"] = false;
          this.detalharCtrc();
          break;
      }
      //this.totalizadorGrid();
    }else{
      console.log('aaa',this.objFormFilter);
      this.toastr.warning('Campos Obrigatórios não preenchidos');
    }
    //  this.controlView = 1;
    //this.collapsedFilter = false;
    //  console.log('filtrar:',this.objFormFilter.value);
  }

  filtrarIndi(event){

    //console.log("vamo nois :: ", event)
    // this.grid.findDataTable('G043');
  }

  detalhar(){
    // console.log("DETALHAR  ::",this.objFormFilter.value);
    this.set(2, "Tomador", "detalhar", null, "fas fa-user");
    this.titleCard = "Visão por Tomador";
    this.nameFuncDetail = 'detalharRota';
    this.grid.findDataTable('detalhesRota');
    document.querySelector('.main-content').scrollTop = 0;
    this.controlView = 2;
  }

  detalharRota(){
    // console.log("DETALHAR Rota ::",this.objFormFilter.value);
    this.titleCard = "Visão por Rota";
    this.nameFuncDetail = 'detalharCidade';
    // this.nameFuncBack = "detalhar";
    this.grid.findDataTable('detalhesRota');
    document.querySelector('.main-content').scrollTop = 0;
    this.controlView = 1;
    if(!this.controlViewTable){
      this.set(3, "Rota", "detalharRota", null, "fas fa-map");

    }
  }

  detalharCidade(){
    // console.log("DETALHAR CIdade ::",this.objFormFilter.value);
    this.titleCard = "Visão por Cidade";
    this.nameFuncDetail = 'detalharCtrc';
    // this.nameFuncBack = "detalharRota";
    this.grid.findDataTable('detalhesCidade');
    document.querySelector('.main-content').scrollTop = 0;
    this.controlView = 2;
    if(!this.controlViewTable){
      this.set(4, "Cidade", "detalharCidade", null, "fas fa-map-marker-alt");
    }
  }

  detalharCtrc(){
    // console.log("DETALHAR CTRC ::",this.objFormFilter.value);
    this.titleCard = "Visão por Documentos";
    //this.nameFuncDetail = 'detalharNada';
    // this.nameFuncBack = "detalharCidade";
    this.grid.findDataTable('detalhesCtrc');
    document.querySelector('.main-content').scrollTop = 0;
    this.controlView = 3;
    if(!this.controlViewTable){
      this.set(5, "CTRC", "detalharCtrc", null, "fas fa-file-alt");
    }
  }

  openCarga(){
    this.grid.loadGridShow();
    // this.objFormCarga.reset();
    this.cargaService.buscaParadas({ doc: this.objFormFilter.controls['lsDocumentos'].value, cdo:this.objFormFilter.controls['IDG024'].value.id}).subscribe(
      data=>{
        // console.log("DATA === >> ",this.objFormCarga.value);
        this.arGridCarga = data.data;
        if(this.arGridCarga.length != 0){
          this.setPesoValorGeral();
          this.estruturaForm();
          this.objFormCarga.controls['SNMOBILE'].setValue({id: 'N' , text: 'Não'});
          this.objFormCarga.controls['TPCARGA'].setValue({id: 2 , text: 'PALETIZADA'});
          //this.objFormCarga.controls['SIMNAOOFERECE'].setValue('I');
          this.objFormCarga.controls['IDG003OR'].setValue({id: this.objFormFilter.controls['IDG024'].value.idg003, text: this.objFormFilter.controls['IDG024'].value.nmcidade + ' - '+ this.objFormFilter.controls['IDG024'].value.cdestado});
          this.objFormCarga.controls['IDG003DE'].setValue({id: this.arGridCarga[this.arGridCarga.length - 1].IDG003DE, text: this.arGridCarga[this.arGridCarga.length - 1].NMCIDADE + ' - '+ this.arGridCarga[this.arGridCarga.length - 1].CDESTADE});
          this.objFormCarga.controls['IDG024_CARGA'].setValue(this.objFormFilter.controls['IDG024'].value);

          if(this.arGridCarga[0].CHILD2  != undefined && this.arGridCarga[0].CHILD2.TPTRANSP != undefined){
            this.objFormCarga.controls['TPTRANSP'].setValue({id:this.arGridCarga[0].CHILD2.TPTRANSP, text:this.utils.tipoTransporte(this.arGridCarga[0].CHILD2.TPTRANSP)});
          }
          // ##### MENOR DATA DE VENCIMENTO #####
          let dataVencimento : any;
          let firstIteration = true;
          for(let i in this.arGridCarga){
            for(let j in this.arGridCarga[i].CHILD){
              let dtVencChild = this.utils.getStringFromDateJs(this.utils.dataTimeDG(this.arGridCarga[i].CHILD[j].DTVENCTO));
              if(firstIteration){
                dataVencimento = this.utils.getStringFromDateJs(this.utils.dataTimeDG(this.arGridCarga[i].CHILD[j].DTVENCTO));
                firstIteration = false;
              }
              if(dtVencChild <= dataVencimento){
                dataVencimento = dtVencChild;
              }
            }
            this.arGridCarga[i].DTVENCTO = dataVencimento;

            dataVencimento = '';
            firstIteration = true;

          }
          // ##### #####
          this.openCargaBreadcrumb();
        }else{
          this.toastr.warning("Nenhum Documento Selecionado");
        }

        this.grid.loadGridHide();
        //console.log(this.arGridCarga);
      },
      err=>{
        this.grid.loadGridHide();
      }
    );
  }

  openCargaBreadcrumb(){
    this.set(6, "Carga", "openCargaBreadcrumb", null, "fas fa-archive");
    document.querySelector('.main-content').scrollTop = 0
    this.controlViewTable = false;
    this.controlView = 6;
    this.carregando = true;
  }

  setPesoValorGeral(){
    this.objFormCarga.controls['PSCARGA'].setValue(0);
    this.objFormCarga.controls['VRCARGA'].setValue(0);
    this.qtdNf   = 0;
    this.qtdCtrc = 0;
    // this.totCtrc = 0;
    // this.totDelivery = 0;
    // debugger;
    for(let i of this.arGridCarga){
      this.objFormCarga.controls['PSCARGA'].setValue(this.objFormCarga.controls['PSCARGA'].value + i.PSBRUTO);
      this.objFormCarga.controls['VRCARGA'].setValue(this.objFormCarga.controls['VRCARGA'].value + i.VRMERCAD);
      if(i.LSNFE != null){
        this.qtdNf = this.qtdNf + i.LSNFE.split(',').length;
      }
      if(i.LSCTE != null){
        this.qtdCtrc = this.qtdCtrc + i.LSCTE.split(',').length;
      }

      // if( i.CHILD[0].IDG051 != null || i.CHILD[0].IDG043 != null){
      //   if(i.CHILD[0].IDG051){
      //       this.totCtrc += i.PSBRUTO;
      //   }else if(i.CHILD[0].IDG043){
      //       this.totDelivery += i.PSBRUTO;
      //   }
      // }
    }

    //console.log("Total de peso bruto ctrc= ", this.totCtrc);
    //console.log("Total de peso bruto delivery= ", this.totDelivery);
    // if(this.totCtrc > this.totDelivery){
    //   // let objCtrc = {"idg051":this.arGridCarga[0].CHILD[0].IDG051,"totalCtrc":this.totCtrc};
    //   // this.objFormCarga.controls['TPTRANSP'].setValue({id:1,text:"ctrc"});
    //   this.setTipoTransp({"idg051":this.arGridCarga[0].CHILD[0].IDG051,"totalCtrc":this.totCtrc,"totalDelivery":this.totDelivery});
    // }else if(this.totCtrc < this.totDelivery){
    //   // let objDelivery = {"idg043":this.arGridCarga[0].CHILD[0].IDG043,"totalDelivery":this.totDelivery};
    //   this.setTipoTransp({"idg043":this.arGridCarga[0].CHILD[0].IDG043,"totalDelivery":this.totDelivery,"totalCtrc":this.totCtrc});
    // }
    //console.log("Peso da carga ",this.objFormCarga.controls['PSCARGA'].value);

    //Sugere o tipo de veiculo baseado no peso bruto
    this.getPesoCarga({'pesoBruto':this.objFormCarga.controls['PSCARGA'].value,'SIMNAOOFERECE':this.objFormCarga.controls['SIMNAOOFERECE'].value});
}

  moveColums(action, index){
    if(action == 'up'){
      if(index != 1){
        for(let item in this.arGridCarga){
          if(this.arGridCarga[item].index == index){
            let aux = this.arGridCarga[parseInt(item)-1];
            let indexAux = this.arGridCarga[parseInt(item)-1].index;
            let indexAtu = this.arGridCarga[item].index;

            this.arGridCarga[parseInt(item)-1] = this.arGridCarga[item];
            this.arGridCarga[item]= aux;
            this.arGridCarga[parseInt(item)-1].index = indexAux;
            this.arGridCarga[item].index = indexAtu;
            break;
          }
        }
      }
    }else{
      if(index != this.arGridCarga.length){
        for(let item in this.arGridCarga){
          if(this.arGridCarga[item].index == index){
            let aux = this.arGridCarga[parseInt(item)+1];
            let indexAux = this.arGridCarga[parseInt(item)+1].index;
            let indexAtu = this.arGridCarga[item].index;

            this.arGridCarga[parseInt(item)+1] = this.arGridCarga[item];
            this.arGridCarga[item]= aux;
            this.arGridCarga[parseInt(item)+1].index = indexAux;
            this.arGridCarga[item].index = indexAtu;
            break;
          }
        }
      }
    }
  }

  confirmarSalvarCarga(snUtiCid = false){

      if(true || this.validaFormularioValido(this.objFormCarga)){
        if(true || this.validaEscolta(this.objFormCarga.controls['SNESCOLT'].value) ){
          this.grid.loadGridShow();
          var obj = {
            form: Object.assign({},this.objFormCarga.value),
            grid: this.arGridCarga,
            api: {DISTANCE:0, DURATION:0}
          };

          var that = this;
          obj.form.DSCARGA = obj.form.IDG003OR.text + ' X ' + obj.form.IDG003DE.text;

          var dtColetaAux = null;
          dtColetaAux = this.objFormCarga.controls['DTCOLETA'].value.date;
          dtColetaAux = new Date(parseInt(dtColetaAux.year), parseInt(dtColetaAux.month) - 1, parseInt(dtColetaAux.day));


          var dtPreSaiAux = null;
          dtPreSaiAux = this.objFormCarga.controls['DTPRESAI'].value.date;
          dtPreSaiAux = new Date(parseInt(dtPreSaiAux.year), parseInt(dtPreSaiAux.month) - 1, parseInt(dtPreSaiAux.day));

          if(dtPreSaiAux < dtColetaAux){
            this.toastr.warning( "Data da coleta não pode ser inferior a data de saída","Atenção");
            this.grid.loadGridHide();
            return false;

          }




           

          var arParadas  = [];
          var objParadas = "";
          var objParadasInicio = "";
          var objParadasAux = "";
          var lQtDisPer = 0;
          var stations = [];
          var stations2 = [];
          var paradas = this.arGridCarga;
          var service = new google.maps.DirectionsService;
          this.qtParadas = this.arGridCarga.length;
          this.qtParadasAtual = 0;
          this.qtParadasAtual2 = 0;

          //Objeto com a Cidade Origem
          stations.push({lat: this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit});      
          //Objetos com as Paradas
          for (var i = 0; i < paradas.length; i++) {
            if((paradas[i].NRLONGITEM != null && paradas[i].NRLONGITEM != 0) && (paradas[i].NRLATITUEM != null && paradas[i].NRLATITUEM != 0)){
              stations.push({lat: paradas[i].NRLATITUEM, lng:paradas[i].NRLONGITEM});
            }else{
              if(snUtiCid){
                stations.push({lat: paradas[i].NRLATITUCI, lng:paradas[i].NRLONGITCI});
              }else{
                stations.push({lat: paradas[i].NRLATITUDE, lng:paradas[i].NRLONGITDE});
              }
            }
          }

          console.log('stations', stations);
          // Divide a rota para várias partes porque o limite máximo de estações é de 25 (23 pontos de referência + 1 origem + 1 destino)
          for (var i = 0, parts = [], max = 25 - 1; i < stations.length; i = i + max)
            parts.push(stations.slice(i, i + max + 1));




          //Objeto com a Cidade Origem x Destino
          stations2.push({lat: this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit});      
          //Objetos com as Paradas
          for (var i = 0; i < paradas.length; i++) {
            if(i == 0){
              
              if(snUtiCid){
                stations2.push({lat: paradas[i].NRLATITUCI, lng:paradas[i].NRLONGITCI});
              }else{
                stations2.push({lat: paradas[i].NRLATITUDE, lng:paradas[i].NRLONGITDE});
              }

            }else{

              stations2.push({lat: this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit});      
              if(snUtiCid){
                stations2.push({lat: paradas[i].NRLATITUCI, lng:paradas[i].NRLONGITCI});
              }else{
                stations2.push({lat: paradas[i].NRLATITUDE, lng:paradas[i].NRLONGITDE});
              }

            }
          }

          console.log('stations2', stations2);
          // Divide a rota para várias partes porque o limite máximo de estações é de 25 (23 pontos de referência + 1 origem + 1 destino)
          for (var j = 0, parts2 = [], max2 = 25 - 1; j < stations2.length; j = j + max)
            parts2.push(stations2.slice(j, j + max2 + 1));

            console.log('parts', parts, obj.grid);
            console.log('parts2', parts2, obj.grid);
              

        // Chamada de serviço para processar os resultados do serviço
        var service_callback = (response, status) => {
          if (status == google.maps.DirectionsStatus.OK) {
            //that.nrTravaCallBack = (that.nrTravaCallBack + 1);
            //debugger;
            console.log('auauauaua', response);
            var bloco = "";
            var entragaAux = 0;
            for (let x = 0; x < response.routes[0].legs.length; x++) {
              this.qtParadasAtual++;

              if (x == 0) {
                console.log('if x == 0');
                for (var i = 0; i < parts.length; i++) {
                  if ((response.request.origin.location.lng() + "").substring(0, parts[i][0].lng.toString().length) == parts[i][0].lng.toString() &&
                    (response.request.origin.location.lat() + "").substring(0, parts[i][0].lat.toString().length) == parts[i][0].lat.toString()) {
                    console.log(":::::: Bloco: " + i);
                    bloco = i.toString();
                  }
                }
              }

              let dsdisnta = response.routes[0].legs[x].distance.value; // Metro to KM
              let horas = this.secondsToTime(response.routes[0].legs[x].duration.value);
              let tpestima = horas.h + ':' + horas.m + ':' + horas.s;
              console.log("Bloco: " + bloco + ' Parada ' + (x+1) + ' - Distância: ' + dsdisnta + ' Duração: ' + tpestima);

              lQtDisPer += dsdisnta;

              //this.qtParadasAuxiliar = (x+1);

              if(bloco == '0'){
                entragaAux = 0;
              }else{
                entragaAux = 24;
              }

              if(bloco == '0'){
                obj.grid[x].DURATION = response.routes[0].legs[x].duration.value;
                obj.grid[x].DISTANCE = dsdisnta;
              }else if(bloco == ' '){
                obj.grid[entragaAux+x].DURATION = response.routes[0].legs[x].duration.value;
                obj.grid[entragaAux+x].DISTANCE = dsdisnta;

                console.log('opa:::',entragaAux+x);
              }
            }

            

            console.log('>>:',this.qtParadasAtual , this.qtParadas);
            if(this.qtParadasAtual >= this.qtParadas){
              console.log('vou chamat tino');
              that.initMapFinal();
              //that.nrTravaCallBack = 0;


              console.log("FOOOOOOIIIIIII ::::", obj);
              obj.form.QTDISPER = (lQtDisPer/1000);

              // termina aqui 
              that.cargaService.validaDatas(obj).subscribe(
                data=>{

                  that.objValidaPerformace = {
                    ok: 0,
                    nok: 0,
                    total: 0
                  };

                  that.objValidaPerformaceICC = {
                    pesoDist: 0,
                    distTotal: 0
                  };
                  console.log("VOOLLTOOOOOOOOUUUUU ::::", data);
                  that.objSaveCarga = data;

                  let arClientes   = [];
                  let arRemetente  = [];
                  let arVeiculos   = [];
                  let arMotoristas = [];
                  var arCTE        = "";
                  var arNFE        = "";

                  for(let item of data.grid){
                    arClientes.push(item.IDG005DE)
                  }



                  for (var i = 0; i < data.grid.length; i++) {

                    arRemetente.push([data.grid[i].IDG005RE, data.grid[i].VRMERCAD]);

                    if(data.grid[i].LSCTE != null){
                      arCTE += data.grid[i].LSCTE + ',';
                    }

                    if(data.grid[i].LSNFE != null){
                      arNFE += data.grid[i].LSNFE + ',';
                    }
                  }

                  that.distTotal = 0;
                  that.pesoDist  = 0;
                  let pesoTotal  = 0;
                  let aux = 0;

                  that.distTotal = that.objSaveCarga.form.QTDISPER;
                  pesoTotal = that.objSaveCarga.form.PSCARGA;
                  
                  for(let i = 0;i < data.grid.length; i ++){
                    if(i == 0){

                      that.pesoDist += (100 * (data.grid[i].DISTANCE/1000));
                      aux = pesoTotal - data.grid[i].PSBRUTO;
                      console.log('peso brutao', data.grid[i].PSBRUTO );
                      console.log('peso total', pesoTotal );
                      console.log('aux', aux );
                      console.log('pesdist', that.pesoDist );
                      console.log('distancia', (data.grid[i].DISTANCE/1000), data.grid[i].DISTANCE );
                    
                    }else{

                      that.pesoDist += (((aux/pesoTotal)*100) * (data.grid[i].DISTANCE/1000));
                      aux = aux - data.grid[i].PSBRUTO;
                      console.log('peso brutao22', data.grid[i].PSBRUTO );
                      console.log('aux22', aux );
                      console.log('pesdist22', that.pesoDist );

                    }

                  

                    console.log('distancia total', that.distTotal );
                    console.log('pesdistTOPER', that.pesoDist );

                    that.objProgressICC.value = Math.round(that.pesoDist/that.distTotal);

                    console.log('aaaaa',that.objProgressICC.value);
                    that.objFormCarga.controls['VRICCCAR'].setValue(that.objProgressICC.value);

                    if(that.objProgressICC.value <= 50){
                      that.objProgressICC.type='danger';
                    }else if(that.objProgressICC.value < 80){
                      that.objProgressICC.type='warning';
                    }else{
                      that.objProgressICC.type='success';
                    }
                    
                  
                  
                    console.log('>>>', data.grid[i], data.grid, i);
                    for (var j = 0; j < data.grid[i].CHILD.length; j++) {
                      let dtFinEta = new Date(data.grid[i].DTFINETA);
                      let dtVencto = new Date(data.grid[i].CHILD[j].DTVENCTO);

                      if(dtFinEta <= dtVencto){
                        that.objValidaPerformace.ok += 1;
                      }else{
                        that.objValidaPerformace.nok += 1;
                      }

                      that.objValidaPerformace.total += 1;
                    }

                  }

                  arCTE = arCTE.substr(0, arCTE.length-1);
                  arNFE = arNFE.substr(0, arNFE.length-1);

                  that.objProgress.value = (that.objValidaPerformace.ok*100)/that.objValidaPerformace.total;
                  that.objFormCarga.controls['VRPERCAR'].setValue(that.objProgress.value);

                  if(that.objProgress.value <= 50){
                    that.objProgress.type='danger';
                  }else if(that.objProgress.value < 80){
                    that.objProgress.type='warning';
                  }else{
                    that.objProgress.type='success';
                  }
                  //VEICULOS
                  if(data.form.IDG032V1){
                    arVeiculos.push(data.form.IDG032V1.id);
                  }
                  if(data.form.IDG032V2){
                    arVeiculos.push(data.form.IDG032V2.id);
                  }
                  if(data.form.IDG032V3){
                    arVeiculos.push(data.form.IDG032V3.id);
                  }

                  //MOTORISTAS
                  if(data.form.IDG031M1){
                    arMotoristas.push(data.form.IDG031M1.id);
                  }
                  if(data.form.IDG031M2){
                    arMotoristas.push(data.form.IDG031M2.id);
                  }
                  if(data.form.IDG031M3){
                    arMotoristas.push(data.form.IDG031M3.id);
                  }
                  //console.log("arClientes ::: ", arClientes);
                  let validaCarga = {
                    valida:{
                      IDG030:   (data.form.IDG030)? data.form.IDG030.id:data.form.IDG030,
                      IDG032:   arVeiculos,
                      IDG031:   arMotoristas,
                      IDG005:   arClientes,
                      PSBRUTO:  data.form.PSCARGA,
                      VRMERCAD: data.form.VRCARGA,
                      SNESCOLT: data.form.SNESCOLT.id,
                      IDG005RE: arRemetente,
                      LSDOCUME: {IDG051: arCTE, IDG043: arNFE},
                      IDG024_CARGA:   that.objFormCarga.controls['IDG024_CARGA'].value
                    }
                  };


                  that.cargaService.validaCarga(validaCarga).subscribe(
                    data=>{

                      that.objValidaCarga = data;
                      that.objValidaCarga.aledtent = that.objSaveCarga.form.ALEDTENT;
                      that.objSaveCarga.form.TPMODCAR = that.objValidaCarga.tpmodcar.toString();
                      that.objSaveCarga.form.QTDISBAS = (that.objFormCarga.controls['QTDISBAS'].value/1000);
                      //that.snProximaEtapa = 1;

                      var modalOco = 0;
                      for (var value in that.objValidaCarga) {
                        // console.log(that.objValidaCarga[value]);
                        if(that.objValidaCarga.idg005 == 0 ||
                            that.objValidaCarga.pcocupac == 0 ||
                            that.objValidaCarga.psbruto == 0 ||
                            that.objValidaCarga.pcocupac == 0 ||
                            that.objValidaCarga.vrmercad == 0 ||
                            that.objValidaCarga.aledtent == 0){
                            modalOco = 1;
                        }
                      }
                      console.log('antes',that.controlView);
                      that.set(7, "Confirmação Carga", "confirmarSalvarCarga", null, "far fa-check-circle");
                      that.controlView = 7;
                      console.log('depois',that.controlView);
                      

                      if(modalOco == 1){
                        that.grid.loadGridHide();
                        that.modal.open(that.modalOcorrencia);
                        console.log('1;;');
                        $('#clickDiv').click();
                      }else{
                        //# perfeito
                        that.grid.loadGridHide();
                        $('#clickDiv').click();
                      }


                    },err=>{
                      that.grid.loadGridHide();
                      console.log('2;;');
                    }
                  );
                },
                err=>{
                  that.grid.loadGridHide();
                  console.log('3;;');
                }
              );
            }

          } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
            //window.alert('Dados de localização não encontrados.');
            console.log('Dados de localização não encontrados.');
            this.confirmarSalvarCarga(true);
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

          console.log('waypoints', waypoints);
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
      }else{
        // console.log('objFormCarga', this.objFormCarga.value);
        this.toastr.warning('Campos Obrigatórios não preenchidos');
      }
    // }
  }

  saveCarga(){
    // console.log(this.objFormCarga.value);
    this.grid.loadGridShow();
    if(this.validaFormularioValido(this.objFormCarga)){
       this.cargaService.saveCarga(this.objSaveCarga).subscribe(
         data=>{
          //  console.log('sucess >>>> ', data);
           //this.modal.closeModal();
           this.toastr.success(data.response, "Sucesso",{closeButton: true, disableTimeOut: true, tapToDismiss: false});
           //let salva = this.objFormCarga.controls['SIMNAOOFERECE'].value;
           this.objFormCarga.reset();
           this.objFormCarga.controls['SIMNAOOFERECE'].setValue('I');
           this.goHome();
           this.grid.loadGridHide();
         },
         err=>{
         //console.log('Ops >>>> ', err);
          this.toastr.error(err.error.response);
          this.grid.loadGridHide();

         }
       );
    }else{
      this.toastr.warning('Campos Obrigatórios não preenchidos');
    }
  }

  openSimularRota(){
    console.log(">>>>>>>>", this.arGridCarga);
    // if(this.arGridCarga.length >= 25){
    //   this.toastr.warning( "Limite de paradas excedido", "Não foi possível simular rota");
    // }else{
      var arParadas  = [];
      var arParaAll  = [];
      var objParadas = "";
      var objParaAll  = "";



      //this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit

      var objOrigem  = [this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu , this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit];

      objParadas += this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu + "," + this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit + ";";
      objParaAll += this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu + "," + this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit + ";";




      // for (var i = 0; i < this.arGridCarga.length; i++) {
      //   // debugger;
      //   if((this.arGridCarga[i].NRLONGITEM != null && this.arGridCarga[i].NRLONGITEM != 0) && (this.arGridCarga[i].NRLATITUEM != null && this.arGridCarga[i].NRLATITUEM != 0)){
      //     objParadas += this.arGridCarga[i].NRLONGITEM + ","+this.arGridCarga[i].NRLATITUEM+";"
      //     arParadas[i] = [this.arGridCarga[i].NRLONGITEM , this.arGridCarga[i].NRLATITUEM];

      //     arParaAll[i] = {data:[this.arGridCarga[i].NRLONGITEM , this.arGridCarga[i].NRLATITUEM], empDes: true};
      //     objParaAll += this.arGridCarga[i].NRLONGITEM + ","+this.arGridCarga[i].NRLATITUEM+";"

      //   }else{
      //     objParadas += this.arGridCarga[i].NRLONGITDE + ","+this.arGridCarga[i].NRLATITUDE+";"
      //     arParadas[i] = [this.arGridCarga[i].NRLONGITDE , this.arGridCarga[i].NRLATITUDE];

      //     arParaAll[i] = {data:[this.arGridCarga[i].NRLONGITDE , this.arGridCarga[i].NRLATITUDE], empDes: false};
      //     objParaAll += this.arGridCarga[i].NRLONGITDE + ","+this.arGridCarga[i].NRLATITUDE+";"
      //   }

      // }

      if(objParadas.length > 0){
        objParadas = objParadas.substr(0, objParadas.length - 1);
      }

      if(objParaAll.length > 0){
        objParaAll = objParaAll.substr(0, objParaAll.length - 1);
      }


      // console.log("arParadas >>>", arParadas);
      // console.log("arParaAll >>>", arParaAll);

      //return false;
      this.modal.open(this.modalSimularRota, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
      this.initGoogleMaps(this.arGridCarga);
    // }
  }

  validTitle(){
    this.breadcrumbs.goBack();
    if(this.controlView <= 1){
      this.titleCard = 'Visão por Rota'
    }
  }

  changeOptionView(opc){

    // console.log('changeOptionView',opc);

    if(this.objFormFilter.controls['TPDOCUME'].value.id == 1) {//Delivery
      this.isCTRC = false;
      this.isNota = false;
      this.isDelivery = true;
    } else if(this.objFormFilter.controls['TPDOCUME'].value.id == 2) {//CTRC
      this.isCTRC = true;
      this.isNota = true;
      this.isDelivery = false;
    } else{//Todos
      this.isCTRC = true;
      this.isNota = true;
      this.isDelivery = true;
    }

    this.validOptionsView = opc;
    this.filtrar(true);
  }

  tipoDocumento(){

    // console.log('tipoDocumento::::::::::', this.objFormFilter.controls['TPDOCUME'].value.id);

    if(this.objFormFilter.controls['TPDOCUME'].value.id == 1) {//Delivery
      this.isCTRC = false;
      this.isNota = false;
      this.isDelivery = true;
    } else if(this.objFormFilter.controls['TPDOCUME'].value.id == 2) {//CTRC
      this.isCTRC = true;
      this.isNota = true;
      this.isDelivery = false;
    } else{//Todos
      this.isCTRC = true;
      this.isNota = true;
      this.isDelivery = true;
    }
  }

  validaFormularioValido(objForm) {
    if (objForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  totalizadorGrid(){
    var visao = "";
    var visaoEach = "";
    if(this.controlView == 1){
      visao = "visaoUm";
      visaoEach = 'input[type="hidden"][name^="obj_checkbox_detalhesRota_"]';
    }else if(this.controlView == 2){
      visao = "visaoDois";
      visaoEach = 'input[type="hidden"][name^="obj_checkbox_detalhesCidade_"]';
    }else if(this.controlView == 3){
      visao = "visaoTres";
      visaoEach = 'input[type="hidden"][name^="obj_checkbox_detalhesCtrc_"]';
    }


    this.totalizador.qtctrc = 0;
    this.totalizador.psbruto = 0;
    this.totalizador.vrmercad = 0;
    this.totalizador.qtnfe = 0;

    var obj = this[visao].data_table.rows().data();

    for (var i = obj.length - 1; i >= 0; i--) {
      this.totalizador.qtnfe += obj[i].QTNFE;
      this.totalizador.qtctrc += obj[i].QTCTE;
      this.totalizador.psbruto += obj[i].PSBRUTO;
      this.totalizador.vrmercad += obj[i].VRMERCAD;

    }

    //console.log( 'vrauaaaa', this.totalizador);
    //this.objFormFilter.controls['lsDocumentos'].value.ctrc[visao] = "2094,2095,2102,2110,2097";

    var listaCtrc     = this.objFormFilter.controls['lsDocumentos'].value.ctrc[visao];
    var listaDelivery = this.objFormFilter.controls['lsDocumentos'].value.delivery[visao];

    var lsDocumentosCteAux = {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}};
    var lsDocumentosNfeAux = {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}};
    if(this.objFormFilter.controls['lsDocumentos'].value.ctrc[visao] == "" && this.objFormFilter.controls['lsDocumentos'].value.delivery[visao] == "" && false){
      $('#' + this[visao].id + '-select-all').prop('checked', false);
      $('#' + this[visao].id + '-select-all').click();
    }else{

      $(visaoEach).each(function (obj) {

          var jsonCte = null;
          var dsCte   = null;
          var flagCte = false;

          if(($(this).val()).DSCTE != null){
            jsonCte = JSON.parse($(this).val()).DSCTE;
            dsCte   = JSON.parse($(this).val()).DSCTE;
          }

          if(jsonCte != null){
            jsonCte = jsonCte.split(",");
            for (var i = jsonCte.length - 1; i >= 0 && flagCte == false; i--) {
              if(listaCtrc.indexOf(jsonCte[i]) != -1){
                $(this).prop( "checked", true );
                $(this).click();
              //  console.log('lsDocumentosCteAux',lsDocumentosCteAux);
                lsDocumentosCteAux.ctrc[visao] = lsDocumentosCteAux.ctrc[visao] + "," + dsCte;
                //lsDocumentosCteAux.ctrc[visao] = dsCte;
                flagCte = true;
              }
            }
          }
      });


      $(visaoEach).each(function (obj) {

          var jsonNfe = null;
          var dsNfe   = null;
          var flagNfe = false;

          if(($(this).val()).DSNFE != null){
            jsonNfe = JSON.parse($(this).val()).DSNFE;
            dsNfe   = JSON.parse($(this).val()).DSNFE;
          }


          if(jsonNfe != null){
            jsonNfe = jsonNfe.split(",");
            for (var i = jsonNfe.length - 1; i >= 0 && flagNfe == false; i--) {
              if(listaCtrc.indexOf(jsonNfe[i]) != -1){
                $(this).prop( "checked", true );
                $(this).click();
                // console.log('lsDocumentosNfeAux',lsDocumentosNfeAux);
                lsDocumentosNfeAux.delivery[visao] = lsDocumentosNfeAux.delivery[visao] + "," + dsNfe;
                //lsDocumentosNfeAux.delivery[visao] = dsNfe;
                flagNfe = true;
              }
            }
          }
      });

     this.objFormFilter.controls['lsDocumentos'].value.ctrc[visao]     = lsDocumentosCteAux.ctrc[visao];
     this.objFormFilter.controls['lsDocumentos'].value.delivery[visao] = lsDocumentosNfeAux.delivery[visao];

    }




    this.totalSeleciGrid();
  }


  totalSeleciGrid(){
    ////debugger;
    this.grid.loadGridShow();
    var thisAux = this;
    var visao,json, visaoControl, lsDocumentosAux = null;
    var that  = {qtctrc:0, qtnfe:0, psbruto:0, vrmercad:0};

    lsDocumentosAux = {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}};

    if(this.controlView == 1){
      visao = 'input[type="hidden"][name^="obj_checkbox_detalhesRota_"]';
      visaoControl = "visaoUm";
      //#rota
    }else if(this.controlView == 2){
      visao = 'input[type="hidden"][name^="obj_checkbox_detalhesCidade_"]';
      visaoControl = "visaoDois";

    }else if(this.controlView == 3){
      visao = 'input[type="hidden"][name^="obj_checkbox_detalhesCtrc_"]';
      visaoControl = "visaoTres";
    }

     $($(visao).parent()).each(function (obj) {
       //debugger;
       //console.log('>>>>>', $($(this).children()[0]).prop("checked"));
      if($($(this).children()[0]).prop("checked")){
          json  = JSON.parse($($(this).children()[1]).val());
          that.qtctrc += json.QTCTE;
          that.qtnfe += json.QTNFE;
          that.psbruto += json.PSBRUTO;
          that.vrmercad += json.VRMERCAD;
          if(json.DSCTE != null){
            lsDocumentosAux.ctrc[visaoControl] = lsDocumentosAux.ctrc[visaoControl] + "," + json.DSCTE;
            //lsDocumentosAux.ctrc[visaoControl] =  json.DSCTE;
          }
          if(json.DSNFE != null){
            lsDocumentosAux.delivery[visaoControl] = lsDocumentosAux.delivery[visaoControl] + "," + json.DSNFE;
            //lsDocumentosAux.delivery[visaoControl] = json.DSNFE;
          }

      }
    });

    this.totalSeleci = that;
    this.objFormFilter.controls['lsDocumentos'].value.ctrc[visaoControl]     = lsDocumentosAux.ctrc[visaoControl];
    this.objFormFilter.controls['lsDocumentos'].value.delivery[visaoControl] = lsDocumentosAux.delivery[visaoControl];

    // console.log("aqui raaaa>", this.objfunction[visaoControl], visaoControl, $(visao).parent());

    if(!this.objfunction[visaoControl]){
      $($(visao).parent()).off('click');
      $($(visao).parent()).click({ obj: this }, function (e) {
         thisAux.totalSeleciGrid();
      });
      // this.objfunction[visaoControl] = true;
    }
    this.grid.loadGridHide();
  }

  ordenacao(obj){
    var objFull = this.gridCarga.data_table.rows().data();
    // console.log("FULL PISTOLA :: ", objFull);
    // console.log(" --- >>>  ",obj);
    //debugger;
    //this.gridCarga.data_table.rows().data().push();
    var data = [{
      "CDESTADE":"ESTADO",
      "CDESTARE":"CARA",
      "LSCTE":null,
      "LSNFE":"784, 793",
      "NMCIDADE":"MEU DEUS",
      "NMCIDARE":"CARAMBA",
      "PSBRUTO":1212121,
      "VRMERCAD":0
    }];

    this.grid.findDataTable('gridCargas');
    // console.log("FULL PISTOLA :: ", objFull);
  }

  openDeleteArGridCarga(index){
    this.indexGridCarga = index;
    this.modal.open(this.modalConfirmaDeleteCtrc);
  }

  deleteArGridCarga(){
    this.arGridCarga.splice(this.indexGridCarga, 1);
    this.setPesoValorGeral();
    this.estruturaForm();
    this.modal.closeModal();
  }

  updateTransportadora(){
    // console.log('VEIO DO CAMPO ALTIDG024::::  ',this.objFormCarga.controls['ALTIDG024'].value);
    // console.log('OBJ ARRAY :: ', this.arGridCarga[this.indexGridCarga]);

    let nameTransp = this.objFormCarga.controls['ALTIDG024'].value.text.split(' [')[0];
    let nrlatitu = this.objFormCarga.controls['ALTIDG024'].value.nrlatitu;
    let nrlongit = this.objFormCarga.controls['ALTIDG024'].value.nrlongit;
    if((nrlatitu == 0 || nrlatitu == undefined || nrlatitu == null) || (nrlongit == 0 || nrlongit == undefined || nrlongit == null)){
      this.toastr.warning("Empresa sem informação de Latitude e Longitude, Necessário completar o cadastro!", 'Alerta', {closeButton: true, disableTimeOut: true});
    }else{
      this.arGridCarga[this.indexGridCarga].NMEMPDES = nameTransp;
      this.arGridCarga[this.indexGridCarga].CDEMPDES = this.objFormCarga.controls['ALTIDG024'].value.id;
      this.arGridCarga[this.indexGridCarga].NRLATITUEM = this.objFormCarga.controls['ALTIDG024'].value.nrlatitu;
      this.arGridCarga[this.indexGridCarga].NRLONGITEM = this.objFormCarga.controls['ALTIDG024'].value.nrlongit;
      this.modal.closeModal();
    }
  }

  atribuirTransportadoras(index, obj){
    this.indexGridCarga = index;
    // debugger;
    if(this.arGridCarga[index].CDEMPDES){
      this.objFormCarga.controls['ALTIDG024'].setValue({id: this.arGridCarga[index].CDEMPDES, text:this.arGridCarga[index].NMEMPDES});
      this.validRemoveTransp = true;
    }else{
      this.objFormCarga.controls['ALTIDG024'].setValue(null);
      this.validRemoveTransp = false;
    }
    this.modal.open(this.modalAtribuirTransportadora);
  }

  removerTransportadora(){
    this.arGridCarga[this.indexGridCarga].NMEMPDES = null;
    this.arGridCarga[this.indexGridCarga].CDEMPDES = null;
    this.arGridCarga[this.indexGridCarga].NRLATITUEM = null;
    this.arGridCarga[this.indexGridCarga].NRLONGITEM = null;

    this.modal.closeModal();
  }

  estruturaForm(){

    this.snDelivery = 0;

    // this.objFormCarga.controls['IDG030'].setValue(null);

    // console.log("SIMNAOOFERECE ANTES:: ", this.objFormCarga.controls['SIMNAOOFERECE'].value);

    for(let i = 0; i < this.arGridCarga.length; i++){
      if(this.arGridCarga[i].LSNFE != null){
         //console.log("axeiii:: ", this.arGridCarga[i].LSNFE);
         this.snDelivery = 1;  //# Necessário oferecer caso for 1
         this.objFormCarga.controls['SIMNAOOFERECE'].setValue('A');
      } 
    }

    // console.log("SIMNAOOFERECE DEPOIS:: ", this.objFormCarga.controls['SIMNAOOFERECE'].value);
    /* TIPO DE VEICULO É OBRIGATORIO
    if(this.objFormCarga.controls['SIMNAOOFERECE'].value == 'A'){
      //# REGRAS FORM SEM OFERECIMENTO
      this.objFormCarga.controls['IDG030'].clearValidators();
      this.objFormCarga.controls['IDG030'].updateValueAndValidity();

    } else if (this.objFormCarga.controls['SIMNAOOFERECE'].value == 'I'){
      //# REGRAS FORM COM OFERECCIMENTO
      this.objFormCarga.controls['IDG034'].setValue(null);
      this.objFormCarga.controls['IDG030'].setValidators([Validators.required]);
      this.objFormCarga.controls['IDG030'].updateValueAndValidity();

    }
    */
    // console.log("objFormCarga :: ", this.objFormCarga);
    // console.log("oxiii", this.arGridCarga);
  }

  openModalVeiculo(){
    this.modal.open(this.modalVeiculo, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  openModalMototrista(){
    this.modal.open(this.modalMotorista, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  validaEscolta(event){

    let valida = true;
    if(event.id == 'S'){

      // COM ESCOLTA
      if(this.objFormCarga.controls['VRCARGA'].value > this.objFormParametrosAux.controls['VRCARESC'].value){
        this.toastr.warning("Valor da carga ultrapassa valor máximo com escolta", this.utils.formataDinheiro(this.objFormParametrosAux.controls['VRCARESC'].value));
        valida = false;
      }
    }else{
      // SEM ESCOLTA
      if(this.objFormCarga.controls['VRCARGA'].value > this.objFormParametrosAux.controls['VRCARNOR'].value){
        this.toastr.warning("Valor da carga ultrapassa valor máximo sem escolta", this.utils.formataDinheiro(this.objFormParametrosAux.controls['VRCARNOR'].value));
        valida = false;
      }
    }
    // console.log("totalSeleci.vrmercad ", this.objFormCarga.controls['VRCARGA'].value);
    // console.log("VRCARESC ::: ", this.objFormParametrosAux.controls['VRCARESC'].value);
    // console.log("VRCARNOR ::: ", this.objFormParametrosAux.controls['VRCARNOR'].value);

    return valida;
  }

  clearMotVei(){
    this.objFormCarga.controls['IDG032V1'].reset();
    this.objFormCarga.controls['IDG031M1'].reset();
    this.objFormCarga.controls['IDG032V2'].reset();
    this.objFormCarga.controls['IDG031M2'].reset();
    this.objFormCarga.controls['IDG032V3'].reset();
    this.objFormCarga.controls['IDG031M3'].reset();
  }

  limpar(){
    this.objFormFilter.reset();
    this.filtrar(true);
  }

  detalharLinha(i){
    //debugger;
    if(this.linhas[i] == false || this.linhas[i] == undefined){
      this.linhas[i] = true;
    }else{
      this.linhas[i] = false;
    }
  }

  detalharGrid(action){
    switch(action){
      case'D':
        for(let i = 0; i < this.arGridCarga.length; i++){
          this.linhas[i] = true;
        }
        this.detalhando = true;
        break;
      case'O':
        for(let i = 0; i < this.arGridCarga.length; i++){
          this.linhas[i] = false;
        }
        this.detalhando = false;
        break;
    }
  }

  setTipoVeiculo(event) {
    this.objFormCarga.controls['IDG030'].setValue({ id: event.idg030, text: event.dstipvei, qtcappes: event.qtcappes });
  }


  validaMontarCarga4PL(){
    var IDS001 = null;
    IDS001 = {IDS001:localStorage.getItem('IDS001')};

    this.cargaService.validaMontarCarga4PL(IDS001).subscribe(
      data=>{
          // console.log("aaaaaa", data);
          if(data.SNCAR4PL){
            this.objFormFilter.controls['TPDOCUME'].setValue({id: 1 , text: 'Delivery'});
            this.isVerifica4pl = 1;
          }else{
            this.objFormFilter.controls['TPDOCUME'].setValue({id: 2 , text: 'CTRC'});
            this.objFormFilter.controls['IDT005'].setValue({id: 1 , text: 'BRAVO 3PL'});
            this.isVerifica4pl = 0;
          }
          this.snCar4pl = data.SNCAR4PL;
          
        
      }
    );

  }

  initGoogleMaps(obj, snUtiCid = false) {
    var that = this;
    var objInit = obj;
    var service = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map'), {
      //center: origin,
      zoom: 5,
      zoomControl: true,
      scaleControl: false,
      scrollwheel: true,
      disableDoubleClickZoom: false
    });

    // Caminho das imagens
    var caminhao = document.location.origin + '/assets/images/maps/caminhao.png';
    var cliente = document.location.origin + '/assets/images/maps/cliente.png';
    var empresa = document.location.origin + '/assets/images/maps/empresa.png';
    var empresaParada = document.location.origin + '/assets/images/maps/empresa-parada.png';
    
    // list of points
    var stations = [];

    //Objeto com a Cidade Origem
    stations.push({lat: this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit, name: 'CD Origem', icon: empresa});


    //this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit

    //Objetos com as Paradas
    for (var i = 0; i < obj.length; i++) {
      if((obj[i].NRLONGITEM != null && obj[i].NRLONGITEM != 0) && (obj[i].NRLATITUEM != null && obj[i].NRLATITUEM != 0)){
        stations.push({lat: obj[i].NRLATITUEM, lng:obj[i].NRLONGITEM, name: `Parada ${i + 1}`, icon: empresaParada});
      }else{
        if(snUtiCid){
          stations.push({lat: obj[i].NRLATITUCI, lng:obj[i].NRLONGITCI, name: `Parada ${i + 1}`, icon: cliente});
        }else{
          stations.push({lat: obj[i].NRLATITUDE, lng:obj[i].NRLONGITDE, name: `Parada ${i + 1}`, icon: cliente});
        }
      }
    }
    console.log("Paradas: ",stations);

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

    // Divide a rota para várias partes porque o limite máximo de estações é de 25 (23 pontos de referência + 1 origem + 1 destino)
    for (var i = 0, parts = [], max = 25 - 1; i < stations.length; i = i + max){
        parts.push(stations.slice(i, i + max + 1));
    }

    // Chamada de serviço para processar os resultados do serviço
    var service_callback = (response, status) => {
      this.arRotas =[];
      if (status == google.maps.DirectionsStatus.OK) {
        let bloco = "";
        for (var x = 0; x < response.routes[0].legs.length; x++) {
          if (x == 0) {
            for (var i = 0; i < parts.length; i++) {
              if ((response.request.origin.location.lng() + "").substring(0, parts[i][0].lng.toString().length) == parts[i][0].lng.toString() &&
                (response.request.origin.location.lat() + "").substring(0, parts[i][0].lat.toString().length) == parts[i][0].lat.toString()) {
                // console.log("Bloco: " + i);
                bloco = i.toString();
              }
            }
          }
          let dsdisnta = response.routes[0].legs[x].distance.value / 1000; // Metro to KM
          let horas = this.secondsToTime(response.routes[0].legs[x].duration.value);
          let tpestima = horas.h + ':' + horas.m + ':' + horas.s;
          // console.log("Bloco: " + bloco + ' Parada ' + (x+1) + ' - Distância: ' + dsdisnta + ' Duração: ' + tpestima);
          this.arRotas.push({distancia:response.routes[0].legs[x].distance.value,duracao:response.routes[0].legs[x].duration.value});
          console.log("Array Rotas-> ",this.arRotas);
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
        //window.alert('Dados de localização não encontrados.');
        console.log('Dados de localização não encontrados.');
        that.initGoogleMaps(objInit, true);
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
        waypoints.push({ location: parts[i][j], stopover: false });
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

  attachSecretMessage(marker, secretMessage) {
    var infowindow = new google.maps.InfoWindow({
      content: secretMessage
    });
    infowindow.open(marker.get('map'), marker);
    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });
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




  initMapFinal(snUtiCid = false) {
    console.log('initMapFinal', snUtiCid);
    var that = this;
    var stations = [];
    var paradas = this.arGridCarga;
    var ultimaParada = {};
    var service = new google.maps.DirectionsService;
    this.qtParadas = this.arGridCarga.length;
    this.qtParadasAtual = 0;
    this.qtParadasAtual2 = 0;

    //Objetos com as Paradas
    for (var i = 0; i < paradas.length; i++) {
      if((paradas[i].NRLONGITEM != null && paradas[i].NRLONGITEM != 0) && (paradas[i].NRLATITUEM != null && paradas[i].NRLATITUEM != 0)){
        ultimaParada = {lat: paradas[i].NRLATITUEM, lng:paradas[i].NRLONGITEM};
      }else{
        if(snUtiCid){
          ultimaParada = {lat: paradas[i].NRLATITUCI, lng:paradas[i].NRLONGITCI};
        }else{
          ultimaParada = {lat: paradas[i].NRLATITUDE, lng:paradas[i].NRLONGITDE};
        }
      }
    }

    //Objeto com a ultima parada
    stations.push(ultimaParada);

    //Objeto com a Cidade Origem
    stations.push({lat: this.objFormCarga.controls['IDG024_CARGA'].value.nrlatitu, lng:this.objFormCarga.controls['IDG024_CARGA'].value.nrlongit});      

    //debugger;
    // Divide a rota para várias partes porque o limite máximo de estações é de 25 (23 pontos de referência + 1 origem + 1 destino)
    for (var i = 0, parts = [], max = 25 - 1; i < stations.length; i = i + max)
        parts.push(stations.slice(i, i + max + 1));

    // Chamada de serviço para processar os resultados do serviço
    var service_callback = (response, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        //that.nrTravaCallBack = (that.nrTravaCallBack + 1);
        //debugger;
        console.log('auauauaua', response);
        var bloco = "";
        var entragaAux = 0;
        for (let x = 0; x < response.routes[0].legs.length; x++) {
          this.qtParadasAtual++;

          if (x == 0) {
            console.log('if x == 0');
            for (var i = 0; i < parts.length; i++) {
              if ((response.request.origin.location.lng() + "").substring(0, parts[i][0].lng.toString().length) == parts[i][0].lng.toString() &&
                (response.request.origin.location.lat() + "").substring(0, parts[i][0].lat.toString().length) == parts[i][0].lat.toString()) {
                console.log(":::::: Bloco: " + i);
                bloco = i.toString();
              }
            }
          }

          let dsdisnta = response.routes[0].legs[x].distance.value; // Metro to KM
          let horas = this.secondsToTime(response.routes[0].legs[x].duration.value);
          let tpestima = horas.h + ':' + horas.m + ':' + horas.s;
          console.log("Bloco: " + bloco + ' Parada ' + (x+1) + ' - Distância: ' + dsdisnta + ' Duração: ' + tpestima);

   
          if(bloco == '0'){
            entragaAux = 0;
          }else{
            entragaAux = 24;
          }

          that.objFormCarga.controls['QTDISBAS'].setValue(dsdisnta);
          console.log('QTDISBAS', dsdisnta);

        }


      } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
        //window.alert('Dados de localização não encontrados.');
        console.log('Dados de localização não encontrados.');
        that.initMapFinal(true);
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





}
