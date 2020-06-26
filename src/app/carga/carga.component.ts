// ##### IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation, ɵConsole, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { DragulaService } from 'ng2-dragula';
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';
import * as moment from 'moment';

declare var google: any;
declare let JsBarcode: any;

// ##### COMPONENTES
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { ConhecimentoService } from '../shared/componentesbravo/src/app/services/crud/conhecimento.service';




// ##### SERVICES
import { CargaService } from './../services/geral/carga.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../services/globals.services';
import { DocumentoViagemService } from '../services/crud/documentoViagem.service';

import { InfoParadas } from '../shared/componentesbravo/src/app/models/info-paradas.model';

import { DeliverysNewService } from '../shared/componentesbravo/src/app/services/crud/deliveryNew.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isArray } from 'util';

@Component({
  selector: 'app-carga',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.scss'],
  providers: [NgbCarouselConfig]


})


export class CargaComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();


  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalMobile') private modalMobile;
  @ViewChild('modalDocument') private modalDocument;
  @ViewChild('acc') private acc;
  @ViewChild('modalCarga') modalCarga: any;
  @ViewChild('modalVeiculo') modalVeiculo: any;
  @ViewChild('modalMotorista') modalMotorista: any;
  @ViewChild('modalMapa') modalMapa: any;
  @ViewChild('modalMapaExp') modalMapaExp: any;
  @ViewChild('modalOrdemCarga') modalOrdemCarga: any;
  @ViewChild('modalManifesto') modalManifesto: any;
  @ViewChild('modalPrintLog') modalPrintLog: any;



  @Input() IDG043: any = ''; // - Nota Selecionada
  @Input() IDG051: any = ''; // - Carga Selecionada

  @Input() IDG046: any = ''; // - Carga Selecionada
  @Input() showCarga: any = ''; // - Controller Paradas
  @Input() showParadas: any = ''; // - Controller Paradas


  @ViewChild('modalConhecimento') modalConhecimento: any;
  @Input() mostrarMapa: any = false;

  public errorFound: boolean = false;
  public isSearched: boolean = false;
  advancedFilter:boolean = false;

  cargaObj: any;//InfoCarga;
  arrRestricoes = [];
  arRotas = [];

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "dePara";
  urlCargaGrid        = this.apiUrl+'tp/carga/listar';
  urlQtdTotal         = this.apiUrl+'tp/carga/qtdTotal';

  urlAtribuirOutrosDocumentos = this.apiUrl+'tp/carga/listarAtribuirOutrosDocumentos';
  urlConhecimentoGrid        = this.apiUrl+'tp/conhecimento/listarCarga';

  urlPrintLog        = this.apiUrl+'tp/carga/listPrintLog';
  urlGrid = this.apiUrl + 'tp/documentoViagem/listarPendMotVei'

  url = this.global.getApiHost();
  idCargaView = 0;
  showAll = false;
  listPrintLog = [];

	urlMovimentoGrid    = this.apiUrl+'tp/conhecimento/listarInfMovimento';
	urlProdutoGrid      = this.apiUrl+'tp/conhecimento/listarInfProdutos';
  urlNotasGrid        = this.apiUrl+'tp/conhecimento/listarInfNotas';


  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  arIdsCarga   = [];
  arIds        = [];
  arIdCtrc     = [];
  arIdCarLog   = [];
  click        = [];
  dadosCarga   = [];
  dadosCabecalho   = [];
  clickSelecionados  = [];
  clickExistentes    = null;
  cargaAtual   = null;
  pesoCarga    = 0.00;
  vlCarga      = 0.00;
  todos        = true;
  classBtn     = 'success';
  btnNome      = 'Marcar';
  checar       = false;
  selecionados = [];
  remetente    = null;
  idConhecimentoView = 0;
  paradasObj: InfoParadas[];
  objfilter = {value:null};
  arIdsIDG043        = [];
  arIdsCDDELIVE      = [];
  arIdsNrNota        = [];
  arIdsIdConhecimento= [];
  arIdsIdSM= [];
  snAdmin = 0;
  
  vrVolumeTotal      = 0;
  conhecimentoAtual  = 0;

  // arIdsIdConhecimento= [];

  objStyle             = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };
  tipoAutor = [{ id: 1, name: "Motorista" }, { id: 2, name: "Veículo" }, { id: 3, name: "Tipo de Veículo" }, { id: 4, name: "Cliente" }];
  // ##### ID's
  idCarga             = null;
  snMobile            = null;
  indicadores = {
    url: this.url + "tp/carga/indicadores"
  }



  // ##### VALIDATORS
  checkViewCarga      = 0;
  collappsed          = null;
  exibir              = 1;
  controlView         = 1;
  /*
    0 -
    1 - GRID CTE
    2 -
    3 - ATRIBUIR MOTORISTAS
    4 - DESMOTAR CARGAS
  */

  // ##### FORMS
  objFormFilter       : FormGroup;
  objFormConfiguracao : FormGroup;
  objFormMotoritas    : FormGroup;
  objFormDesmCarga    : FormGroup;
  objFormCarga        : FormGroup;
  objFormFilterDoc    : FormGroup;
  objConhecimento: any = {};//C.T.R.C;

  // ##### MODAL
  modalRef: NgbModalRef;


  conteudoManifesto = '';

    constructor(
      private mensagens     : MensagensComponent,
      private cargaService : CargaService,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private utilServices  : UtilServices,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      public  translate     : TranslateService,
      private modalService  : NgbModal,
      public  vRef          : ViewContainerRef,
      private dragulaService : DragulaService,
      public ConhecimentoService: ConhecimentoService,
      public deliveryService: DeliverysNewService,
      public config         : NgbCarouselConfig,
      private docService: DocumentoViagemService,

    )
    {
      this.config.interval = 6000;
      this.config.keyboard = true;
      this.config.wrap = true;


      dragulaService.dropModel.subscribe((value) => {
        this.onDropModel();
      });

      this.dragulaService.drop.subscribe(value => {
        console.log(value);
      });

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({
        STCARGA         :[], // STATUS CARGA
        IDG046          :[], // ID CARGA
        IDG030          :[], // ID TIPO DE VEÍCULO
        IDG031          :[], // ID MOTORISTA
        IDG032          :[], // ID VEÍCULO
        IDG032V1        :[], //ID VEICULO 1
        IDG031M1        :[], // ID MOTORISTA 1
        IDS001          :[], // ID USUÁRIO
        IDG024          :[], // ID TRANSPORTADORA
        IDG028          :[], // ARMAZÉM DE COLETA
        DTCARGA         :[], // DATA CARGA
        DTSAICAR        :[], // DATA SAÍDA CARGA
        DTPSMANU        :[], // PREVIÃO DE SAÍDA CARGA
        SNCARPAR        :[], // CARGA PARCIAL (S/N)
        STCADAST        :[], // SITUAÇÃO DE CADASTRO
        G051_CDCTRC     :[], // CODIGO CTRC
        G046_IDCARLOG   :[], // ID CARGA LOGOS
        SNDESLOG        :[], // CARGA DESCIDA PARA LOGOS
        SNDESMON        :[],
        TPMODCAR        :[], // TIPO MODELO CARGA
        SNCRODOC        :[],
        SNCONHEC        :[],
        TPTRANSP        :[],
        VRPERCAR        :[],
        G043_IDG043     :[], // ID DELIVERY
        G043_CDDELIVE   :[], // CD DELIVERY
        G051_IDG051     :[],
        G046_CDVIATRA   :[],
        G043_NRNOTA     :[], // NUMERO DA NOTA
        G046_SNVIRA     :[],
        T012_IDG046     :[],//MALOTE VALIDADO
        // G051_IDG051     :[] // ID CARGA LOGOS
        // IDG005RE : [],
        // IDG005DE : [],
      });


      // ##### H015 -- CONFIGURAÇÃO
      this.objFormConfiguracao = formBuilder.group({
        IDG058    : [],
        IDG005RE  : [],
        IDG005DE  : [],
        STCADAST  : [],
        IDS001    : [],
        IDG024    : [],

      });

      // #####  ATRIBUIR MOTORISTAS
      this.objFormMotoritas = formBuilder.group({
        IDG046    : [],
        IDG024    : [],                           // TRANSPORTADORA
        DTPRESAI  : [],                           // DT. PREVISTA ENTREGA
        DTPRESAIH : [],                           // HR. PREVISTA ENTREGA
        IDG031M1  : [[], [Validators.required]],  // MOTORISTA 1
        IDG031M2  : [],                           // MOTORISTA 2
        IDG031M3  : [],                           // MOTORISTA 3
        IDG032V1  : [[], [Validators.required]],  // VEICULO 1
        IDG032V2  : [],                           // VEICULO 2
        IDG032V3  : [],                           // VEICULO 3
        SNMOBILE  : [],
        IDG030    : []

      });

      // ##### DESMONTAR CARGAS
      this.objFormDesmCarga = formBuilder.group({
        EMPREDES : ['', [Validators.required]],
        EMPRECON : [],
        IDG043   : [],
        IDG051   : []
      });





    this.objFormCarga = formBuilder.group({

      DTPRESAI     : ['', Validators.required], // DATA PREVISÃO DE SAÍDA
      DTPRESAIH    : ['', Validators.required], // DATA PREVISÃO DE SAÍDA - HORA
      IDG024_CARGA : [],  // TRANSPORTADORA CARGA
      PSCARGA      : [],  // PESO CARGA
      IDG030       : [],  // TIPO DE VEICULO


    });

    this.objFormFilterDoc = formBuilder.group({

      IDAUTOR : [],  // TRANSPORTADORA CARGA
      CDAUTOR      : [],  // PESO CARGA
      IDG030       : [],  // TIPO DE VEICULO
      IDT014: [],
      STCADAST: [],
      IDG067: [],
      SNDOWN: [],

    });


    }


    ngOnInit() {
      this.snAdmin = JSON.parse(localStorage.getItem('user')).SNADMIN;
      this.objFormConfiguracao;
      mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';

      //console.log('Chegou isso aqui:: ', this.IDG051)
      if (this.IDG051 != '' && this.IDG051 != null) { // Check if empty value
        this.utilServices.loadGridShow();
        this.ConhecimentoService.getInfoConhecimento({IDG051:this.IDG051, IDG043:this.IDG043}).subscribe(
          data => {

            if(data.data.length > 0){
              this.objConhecimento=data.data[0];
              this.showAll = true;
            }
            //console.log('opa Objeto:',this.objConhecimento);

            this.utilServices.loadGridHide();
          },
          err => {
            this.errorFound = true; // - Controller Error.
            this.utilServices.loadGridHide();
          }
        );
      } else {
        this.errorFound = true; // - Controller Error.
      }

      this.getDadosCabecalhoCarga();
      this.filtrar();


      moment.locale('pt-BR');
      //debugger;
      let data = moment();
      let aux1 = data.format('L');
      let aux2 = data.subtract(15, 'days').format('L');

      let auxB = aux2.split("/");
      let auxA = aux1.split("/");

      this.objFormFilter.controls['DTCARGA'].setValue( { endDate : {year: auxA[2], month: parseInt(auxA[1]), day: parseInt(auxA[0])},
                                                         beginDate   : {year: auxB[2], month: parseInt(auxB[1]), day: parseInt(auxB[0])},
        formatted : aux2+" - "+aux1 } );
      //console.log('aaaa', this.objFormFilter.controls['DTCARGA']);
    }

    totalCargas = [{TT_IDG046 : 0, TT_CAENTR : 0, TT_PSCARGA : 0, TT_VRCARGA : 0}];



    // this. beginDate: {year: 2019, month: 9, day: 1};
    // endDate: {year: 2019, month: 9, day: 1}

    cargaTotal(){
      //// debugger;
      let novoObj = {};

      for( let i of Object.keys(this.objfilter.value))
      {
        novoObj['parameter['+i+']'] = this.objfilter.value[i];
      }

      if(isArray( novoObj['parameter[STCARGA]'])){
        if(novoObj['parameter[STCARGA]'].length > 0){
          novoObj['parameter[STCARGA]'] = novoObj['parameter[STCARGA]'].map(d=>{
            return d.id
          });
          novoObj['parameter[STCARGA]'] = {in:novoObj['parameter[STCARGA]']};
        }else{
          novoObj['parameter[STCARGA]'] = null;
        }

      }

      if(isArray( novoObj['parameter[TPTRANSP]']) &&  novoObj['parameter[TPTRANSP]'].length > 0){
        novoObj['parameter[TPTRANSP]'] = novoObj['parameter[TPTRANSP]'].map(d=>{
          return d.id
        });
        novoObj['parameter[TPTRANSP]'] = {in:novoObj['parameter[TPTRANSP]']};
      }else{
        novoObj['parameter[TPTRANSP]'] = null;
      }
      console.log(novoObj)
      this.cargaService.totalCarga(novoObj).subscribe(
        data=>{
          this.totalCargas = data;
          console.log(this.totalCargas)
        }
      );
    }


    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
      }
    }

    private onDropModel(){

    }


  //######## BREADCRUMBS #########
  //##############################
  set(id, name, functionName,parameter, icon){//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    for(let item of this.arBreadcrumbsLocal){
      if(item.id == data.id || item.name == name){
        valid = false;
      }
    }
    if(valid){
      this.arBreadcrumbsLocal.push(data);
    }
  }
  goHome(event){ //IR PARA TELA INICIAL
    this.objFormConfiguracao.reset()
    this.objFormMotoritas.reset();
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
    this.controlViews = 1;
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
  //##############################

  addCarga(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + this.breadcrumbs.home, "addCarga", null, "fa fa-plus");
    this.checkViewCarga = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewCarga(id) {
    this.mostrarMapa = false;
    // this.objFormConfiguracao.reset();
    // this.exibir = 2
    // this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + this.breadcrumbs.home, "viewCarga", null, "fa fa-plus");
    // var obj = {"IDG058": id};
    // this.checkViewCarga = 1;
    this.idCargaView = id;


        // - Create Controller Obj
        let controllerG046 = {
          IDG046: this.idCargaView,
          G046: true,
          G048: true
        };

        this.deliveryService.getInfoCargaCompletaSemAcl(controllerG046).subscribe(
          data => {
            this.isSearched = true;
            this.cargaObj = data.G046;
            this.arrRestricoes = data.T004;
            this.paradasObj = data.G048;

          },
          err => {
            this.errorFound = true; // - Controller Error.
          }
        );
    this.modal.open(this.modalCarga, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  getDadosCabecalhoCarga() {
    this.cargaService.qtdSituacaoCargas().subscribe(
      data => {
        console.log(data);
        for (let r = 0; r < data.length; r++) {
          this.dadosCabecalho[data[r].STCARGA] = data[r].QTD;
        }
        console.log(this.dadosCabecalho);
      },
      err => {
        this.errorFound = true; // - Controller Error.
      }
    );
  }


  updateCarga(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + this.breadcrumbs.home, "updateCarga", null, "fa fa-plus");
    var obj = {"IDG058": id};
    this.checkViewCarga = 2;
  }



  //##############################



  openDelete(obj){

    obj = JSON.parse(obj);



    if(obj.STCARGA == 'C'){
      this.toastr.warning("Carga já cancelada!", obj.IDG046);
    }else if(obj.STCARGA == 'S'){
      this.toastr.warning("Carga possui agendamento!", obj.IDG046);
    }else if(obj.SNMANFES > 0 ){
      this.toastr.warning("Carga possui manisfesto válido", "Alerta!");
    }else{
     //console.log(obj.TPMODCAR);
    if(obj.TPMODCAR != 1){
      this.toastr.warning("É possivel efetuar o cancelamento apenas de cargas 3PL. Carga 4PL pode ser cancelada apenas pelo sistema Integrador.", obj.IDG046);
    }else{
      this.idCarga = obj.IDG046;
      this.modal.open(this.modalDelete);

    }
  }
}

  deleteCarga(ids){

    if(ids.length == 0){
      this.toastr.warning("Selecione no mínimo uma carga");
    }else{
      this.grid.loadGridShow();
      this.cargaService.validaCancelar({IDG046S: ids}).subscribe(
        data=>{
          if(data.QTD == 0){
            this.idCarga = ids;
            this.modal.open(this.modalDelete);
          }else{
            this.toastr.error("Não é possivel cancelar carga(s)");
          }
          this.grid.loadGridHide();
        }
      );

    }
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteCarga(){
    this.grid.loadGridShow();
    this.cargaService.deleteCarga(this.idCarga).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.grid.loadGridHide();
        this.filtrar();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.grid.loadGridHide();
       }
    );
  }
  //##############################




  //########## DATAGRID ##########
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
  Ids = {in:[]}
  IdCrtc = {in:[]}
  IdCarLog = {in:[]}
  filtrar(){
    //debugger;
    this.Ids = {in:[]};
    this.IdCrtc = {in:[]};
    this.IdCarLog = {in:[]};
    let objfilterAux = Object.assign({}, this.objFormFilter.value);
    var arrayIdsVeicul = []
    var arrayIdsMotor  = []
    let idsG043        = [];
    let idsDELIVE      = [];
    let idsNrNota      = [];
    let IdsIdConhecimento=[];
    let IdsIdSM=[];

    ////debugger;
    if(this.arIds.length > 0 ){
      for(let i of this.arIds){
        this.Ids.in.push(i.name)
      }
      objfilterAux.IDG046 = this.Ids;
    }else{
      this.objFormFilter.controls['IDG046'].setValue(null);
      objfilterAux.IDG046 = null;
    }

    if(this.arIdCtrc.length > 0 ){
      for(let i of this.arIdCtrc){
        this.IdCrtc.in.push(i.name)
      }
      objfilterAux.G051_CDCTRC = this.IdCrtc;
    }else{
      this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
      objfilterAux.G051_CDCTRC = null;
    }


    if(this.arIdCarLog.length > 0 ){
      for(let i of this.arIdCarLog){
        this.IdCarLog.in.push(i.name)
      }
      objfilterAux.G046_IDCARLOG = this.IdCarLog;
    }else{
      this.objFormFilter.controls['G046_IDCARLOG'].setValue(null);
      objfilterAux.G046_IDCARLOG = null;
    }

    //Combobox Multiplos de Veiculos
    if(Array.isArray(objfilterAux.IDG032V1)){

      if(objfilterAux.IDG032V1.length > 0){
          for(let objVeiculos of objfilterAux.IDG032V1){
          arrayIdsVeicul.push(objVeiculos.id);
          }
          objfilterAux.IDG032V1 = {in: arrayIdsVeicul};
      }else{
          objfilterAux.IDG032V1 = null;
      }
    }

    //Combobox Multiplos de Motoristas
    if(Array.isArray(objfilterAux.IDG031M1)){
      if(objfilterAux.IDG031M1.length > 0){
        for(let objMotoristas of objfilterAux.IDG031M1){
          arrayIdsMotor.push(objMotoristas.id);
        }
        objfilterAux.IDG031M1 = {in: arrayIdsMotor};
      }else{
        objfilterAux.IDG031M1 = null;
      }
    }

    //DELIVERY
    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        idsG043.push(i.name);
      }
      objfilterAux.G043_IDG043 = {in: idsG043};
    }else{
      objfilterAux.G043_IDG043 = null;
    }

    //CODIGO DA DELIVERY
    if(this.arIdsCDDELIVE.length > 0 ){
      for(let i of this.arIdsCDDELIVE){
        idsDELIVE.push(i.name);
      }
      objfilterAux.G043_CDDELIVE = {in: idsDELIVE};
    }else{
      objfilterAux.G043_CDDELIVE = null;
    }

    //NUMERO DA NOTA
    if(this.arIdsNrNota.length > 0 ){
      for(let i of this.arIdsNrNota){
        idsNrNota.push(i.name);
      }
      objfilterAux.G043_NRNOTA = {in: idsNrNota};
    }else{
      objfilterAux.G043_NRNOTA = null;
    }

    //ID Conhecimento
    if(this.arIdsIdConhecimento.length > 0 ){
      for(let i of this.arIdsIdConhecimento){
        IdsIdConhecimento.push(i.name);
      }
      objfilterAux.G051_IDG051 = {in: IdsIdConhecimento};
    }else{
      objfilterAux.G051_IDG051 = null;
    }

    //ID Conhecimento
    if(this.arIdsIdSM.length > 0 ){
      for(let i of this.arIdsIdSM){
        IdsIdSM.push(i.name);
      }
      objfilterAux.G046_CDVIATRA = {in: IdsIdSM};
    }else{
      objfilterAux.G046_CDVIATRA = null;
    }


    this.objfilter.value = objfilterAux;
    if(this.controlView == 1){
      this.grid.findDataTable('carga','objfilter');
    }else if(this.controlView == 2){
      this.grid.findDataTable('cargaConhecimento','objfilter');
    }


    //this.cargaTotal();
  }

  limpar(){
    this.objFormFilter.reset();
    this.arIds = [];
    this.filtrar();
  }
  //##############################

  atriMotorista(obj){
    let objAux = JSON.parse(obj);
    console.log();
    if(objAux.STCARGA == 'D'){
      this.toastr.info("Não é possivel atribuir mobile para cargas com status de Entregue", "Alerta!");
    }else{
      if(objAux.SNMANFES > 0 ){
        this.toastr.warning("Carga possui manisfesto válido", "Alerta!");
      }else{

        if((objAux.STCARGA == 'F' || objAux.STCARGA == 'A' || objAux.STCARGA == 'S' || objAux.STCARGA == 'T') /*&& objAux.TPMODCAR == 1*/){


          this.objFormMotoritas.controls['IDG032V1'].setValue(null);
          this.objFormMotoritas.controls['IDG032V2'].setValue(null);
          this.objFormMotoritas.controls['IDG032V3'].setValue(null);


          this.objFormMotoritas.controls['IDG031M1'].setValue(null);
          this.objFormMotoritas.controls['IDG031M2'].setValue(null);
          this.objFormMotoritas.controls['IDG031M3'].setValue(null);



          //# remove options
          $('.ng-option.ng-star-inserted').each(function( index, element ) {

            //element.remove();
            //str.toUpperCase()
            var aux = $(element)[0].outerText.toUpperCase().trim();
            //console.log('>>', index, element, aux);
            if(aux != 'SIM' && aux != 'NÃO' && aux != 'NAO'){
              element.remove();
            }

          });


          let id = objAux.IDG046;
          this.set(1, "Atribuir Motorista", "atriMotorista", obj, "fa fa-plus");
          this.objFormMotoritas.controls['IDG024'].setValue({id: objAux.IDG024 , text: objAux.NMTRANSP });
          this.objFormMotoritas.controls['IDG046'].setValue(objAux.IDG046);
          this.objFormMotoritas.controls['IDG030'].setValue({id: objAux.IDG030 , text: "x" });

          if(objAux.DTPSMANU){
            this.objFormMotoritas.controls['DTPRESAI'].setValue(this.utilServices.getDateObjFromString(objAux.DTPSMANU));

            let hora = this.utilServices.dataTimeDG(objAux.DTPSMANU).split(" ")[1].split(':');

            this.objFormMotoritas.controls['DTPRESAIH'].setValue({hour: hora[0], minute: hora[1]});
          }

          if(objAux.IDG032V1){
            this.objFormMotoritas.controls['IDG032V1'].setValue({id: objAux.IDG032V1 , text: objAux.DSVEICULV1 , idg030: objAux.IDG030 });
          }
          if(objAux.IDG031M1){
            this.objFormMotoritas.controls['IDG031M1'].setValue({id: objAux.IDG031M1 , text: objAux.NMMOTORI1 });
          }

          if(objAux.IDG032V2){
            this.objFormMotoritas.controls['IDG032V2'].setValue({id: objAux.IDG032V2 , text: objAux.DSVEICULV2, idg030: objAux.IDG030 });
          }
          if(objAux.IDG031M2){
            this.objFormMotoritas.controls['IDG031M2'].setValue({id: objAux.IDG031M2 , text: objAux.NMMOTORI2 });
          }

          if(objAux.IDG032V3){
            this.objFormMotoritas.controls['IDG032V3'].setValue({id: objAux.IDG032V3 , text: objAux.DSVEICULV3, idg030: objAux.IDG030 });
          }
          if(objAux.IDG031M3){
            this.objFormMotoritas.controls['IDG031M3'].setValue({id: objAux.IDG031M3 , text: objAux.NMMOTORI3 });
          }

          // this.getMotoristas(id);
          this.exibir = 3;
        }else{
          this.toastr.error("Não é possível atribuir para carga(s) com esse status!");
        }
      }
    }
  }

  // getMotoristas(id){

  // }

  saveMotoristaVeiculo(){
    let existePendencia = this.checkDocument(1, this.objFormMotoritas.controls['IDG031M1'].value.id);
    if (!existePendencia){
      console.log("OKK");
      //this.saveMotorista();
    }else{
      console.log("NOK")
    }
  }

  checkDocument(tipo, cod) { // 1 - motorista 2- veiculo 3 - tipo veiculo 4 - cliente
    let status = false; 
    let IDAUTOR = cod;
    let CDAUTOR = tipo;
    var obj = { "CDAUTOR": CDAUTOR, "IDAUTOR": IDAUTOR };

    this.utilServices.loadGridShow();
    this.cargaService.getDocumentoByAutor(this.objFormMotoritas.value).subscribe(
     data => {
        this.utilServices.loadGridHide();
        console.log("data ", data)
        if (data == null || data == undefined || data == 'null' || data == 'undefined' || data == 'unknown') {
          console.log("[CARGA] motorista NAO tem documento ")
          this.saveMotorista();
          status = false;          
        }else{
          console.log("[CARGA] motorista tem documento ")
          status = true;
          
          //setTimeout(()=>{ 
            this.modal.open(this.modalDocument, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });      
          //}, 1000);	
          // setTimeout(()=>{ 
          //   this.grid.findDataTable('idDataGridFiles','objFormMotoritas');
          // }, 4000);	 

        }
        console.log("Vai retornar ", status)
      },
      err => {
        this.utilServices.loadGridHide();
        console.log("[ERRO]", err)
      }
    );
    
    return status; 
  }


  loadDataGridFiles(){
    this.grid.findDataTable('idDataGridFiles','objFormMotoritas');
  }


  saveMotorista(){
    this.grid.loadGridShow();
    if(this.validaFormularioValido(this.objFormMotoritas)){
      this.cargaService.atriVeiculoMotorista(this.objFormMotoritas.value).subscribe(
        data=>{
          this.toastr.success('Atribuição realizada com sucesso!');
          this.goHome(null);
          this.grid.loadGridHide();
          this.filtrar();
        },
        err=>{
          this.toastr.error(err.error.response);
          this.grid.loadGridHide();

        }
      );
    }else{
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }
  }

  desmontarCarga(ar){
    this.objFormDesmCarga.reset();

    this.arIdsCarga = ar;
    if(ar.length == 0){
      this.toastr.warning("Selecione no mínimo uma carga");
    }else{
      var json;
      let selecionados = [];
      $($('input[type="hidden"][name^="obj_checkbox_carga_').parent()).each(function (obj) {
        if($($(this).children()[0]).prop("checked")){
          json  = JSON.parse($($(this).children()[1]).val());
          selecionados.push(json);
        }
      });

      let validaStatus = true;
      for(let item of selecionados){
        if(item.STCARGA != 'T' && item.STCARGA != 'S' && item.STCARGA != 'F'){
          validaStatus = false;
        }
      }
      if(validaStatus){
        this.exibir = 4;
        this.set(1, "Desmontar Carga(s)", "desmontarCarga", ar, "fas fa-boxes");
      }else{
        this.toastr.warning("É possivel desmontar Carga(s) com status (Agendada e Transporte)");
      }
    }
  }
  getChecados(view){
    var json;
    var that  = {IDG043:[], IDG051:[]};
    $($(view).parent()).each(function (obj) {
      if($($(this).children()[0]).prop("checked")){

         json  = JSON.parse($($(this).children()[1]).val());
         if(json.IDG043 != null){
           that.IDG043.push(json.IDG043);
         }
         if(json.IDG051 != null){
           that.IDG051.push(json.IDG051);
         }
       }
     });
    return that;
  }
  saveDesmontarCarga(){


    this.objFormDesmCarga.controls['IDG043'].setValue([]);
    this.objFormDesmCarga.controls['IDG051'].setValue([]);

    let view1 = 'input[type="hidden"][name^="obj_checkbox_gridCargas1_"]';
    let view2 = 'input[type="hidden"][name^="obj_checkbox_gridCargas2_"]';

    this.objFormDesmCarga.controls['IDG043'].setValue(this.getChecados(view1).IDG043);
    this.objFormDesmCarga.controls['IDG051'].setValue(this.getChecados(view2).IDG051);

    if(this.validaFormularioValido(this.objFormDesmCarga)){

      // if(this.objFormDesmCarga.controls['IDG043'].value.length != 0 || this.objFormDesmCarga.controls['IDG051'].value.length != 0){
      if(this.objFormDesmCarga.controls['IDG051'].value.length != 0){


        this.cargaService.desmontarCarga(this.objFormDesmCarga.value).subscribe(
          data=>{
            this.toastr.success("Carga desmontada com sucesso!");
            this.find('carga');
            this.goHome(null);
          },
          err=>{

          }
        );
      }else{
        this.toastr.warning("Selecione no mínimo um documento!");
      }
    }else{
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }
  }

  filtrarIndi(event){

    this.objFormFilter.value.STCARGA = event;
    if(this.objFormFilter.value.STCARGA == ""){
      this.objFormFilter.value.STCARGA = {"in":['R','O','X','A','S','T','C','E','F']};
    }
    this.grid.findDataTable('carga');
  }

  openModalVeiculo(){
    this.modal.open(this.modalVeiculo, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  openModalMototrista(){
    this.modal.open(this.modalMotorista, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  objCarga: any;
  dtHrAtual:any;

  simcrossdoc = [];
  naocrossdoc = [];


  openMapaCarga(obj){
    obj = JSON.parse(obj);
    this.cargaAtual = obj.IDG046;

    this.simcrossdoc = [];
    this.naocrossdoc = [];

    // if(obj.DTPSMANU == null){
    //   this.toastr.info("Mapa de carga disponível apenas para modelo 3PL", "Alerta!");
    //   return false;
    // }

    //# A pedido do Fernando, 31/05/2019
    //# Deixar imprimir o mapa em todos os status;
    if(true || obj.STCARGA == 'S' || obj.STCARGA == 'A' || obj.STCARGA == 'F'){
      this.grid.loadGridShow();
      this.dtHrAtual = this.getDtHoraAtual();
      this.cargaService.getMapaCarga(obj).subscribe(
        data=>{
          this.vrVolumeTotal = 0;

          for (var i = 0; i < data.notas.length; ++i) {
            this.vrVolumeTotal = (this.vrVolumeTotal + data.notas[i].VRVOLUME);
          }

          this.modal.open(this.modalMapa, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
          this.objCarga = data;

          for (let index = 0; index < this.objCarga.notas.length; index++) {
            if(this.objCarga.notas[index].IDG024CD){
              this.simcrossdoc.push(this.objCarga.notas[index]);
            }else{
              this.naocrossdoc.push(this.objCarga.notas[index]);

            }

            //console.log('x', this.sncrossdoc)
            
          }

          this.grid.loadGridHide();
        },
        err=>{
          this.grid.loadGridHide();
        }
      );
    }else{
      this.toastr.warning("Impossível gerar mapa de cargas nesse status", "Alerta");
    }


  //  this.mapaCarga();
  }

  openMapaExpedicao(obj){
    obj = JSON.parse(obj);
    this.cargaAtual = obj.IDG046;
    //JsBarcode("#barcode", "Hi world!");
    // if( obj.STCARGA == 'S' || obj.STCARGA == 'T' || obj.STCARGA == 'D'){
      this.grid.loadGridShow();
      this.dtHrAtual = this.getDtHoraAtual();
      this.cargaService.getMapaExpedicao(obj).subscribe(
        data=>{
          this.modal.open(this.modalMapaExp, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
          this.objCarga = data;
          
          //console.log(this.objCarga.notas);

          this.ordemEmbarque();


          this.grid.loadGridHide();
          JsBarcode("#barcode", (data.carga.IDCARLOG != null ? data.carga.IDCARLOG : '0000000000'), {width: 2, height: 50});
        },
        err=>{
          this.grid.loadGridHide();
        }
      );
    // }else{
    //   this.toastr.warning("Impossível gerar mapa de expedição nesse status", "Alerta");
    // }
  }

  insereEspaco(data) {
    let espaco = ``;
    if (data > 0) {
      for (let i = 0; i < data; i++) {
        espaco += `&nbsp;`;
      }
    }
    return espaco;
  }

  insereZeros(data) {
    let zeros = ``;
    if (data > 0) {
      for (let i = 0; i < data; i++) {
        zeros += `0`;
      }
    }
    return zeros;
  }

  openManifesto(obj) {
    obj = JSON.parse(obj);

    if (obj.IDG046) {
      this.grid.loadGridShow();
      this.conteudoManifesto = ``;
      this.cargaService.getManifesto({ IDG046: obj.IDG046 }).subscribe(
        data => {

          data.map((d) => {
            d.G051_NRPESO   = this.utilServices.formataPesoSemUnidade(d.G051_NRPESO);
            d.G043_VRDELIVE = this.utilServices.formataPesoSemUnidade(d.G043_VRDELIVE);
            d.G051_VRTOTPRE = this.utilServices.formataPesoSemUnidade(d.G051_VRTOTPRE);
            return d;
          });

          let page          = 1;
          let vlMercadorias = 0;
          let vlPrestacao   = 0;
          let qtPeso        = 0;

          let hrManifesto = `<span>------------------------------------------------------------------------------------------------------------------------------------</span><br>`;
          let hrManifesto2 = `<span>____________________________________________________________________________________________________________________________________</span><br><br>`

          // DEFINE QUANTIDADE DE ESPAÇOS CABEÇALHO
          let qtEspacoCabecalho = (95 - parseInt(data[0].G028_NMARMAZE.length));

          // DEFINE QUANTIDADE DE ESPAÇOS DADOS CARGA
          let qtEspacoDadosCarga = (36 - parseInt(data[0].G046_IDG046.toString().length));

          // DEFINE QUANTIDADE DE ESPAÇOS DADOS MOTORISTA
          let qtEspacoDadosMotorista = 41;
          if (data[0].G031_NRMATRIC) {
            qtEspacoDadosMotorista = (qtEspacoDadosMotorista - parseInt(data[0].G031_NRMATRIC.length));
          }
          if (data[0].G031_NMMOTORI) {
            qtEspacoDadosMotorista = (qtEspacoDadosMotorista - parseInt(data[0].G031_NMMOTORI.length));
          }

          // DEFINE QUANTIDADE DE ESPAÇOS DADOS VEICULO
          let qtEspacoDadosVeiculo = 25;
          if (data[0].G031_CJMOTORI) {
            qtEspacoDadosVeiculo = (qtEspacoDadosVeiculo - parseInt(data[0].G031_CJMOTORI.length));
          }
          if (data[0].G032_NRFROTA) {
            qtEspacoDadosVeiculo = (qtEspacoDadosVeiculo - parseInt(data[0].G032_NRFROTA.length));
          }

          let dadosCarga = `
            ${hrManifesto}
            <span>Carga: ${data[0].G046_IDG046}</span>${this.insereEspaco(qtEspacoDadosCarga)}
            <span>Data da carga: ${data[0].G046_DTCARGA}</span>${this.insereEspaco(27)}
            <span>Previsao de saida: ${data[0].G046_DTPSMANU}</span>
            <br>
            <span>Motorista: ${data[0].G031_NRMATRIC || ''} ${data[0].G031_NMMOTORI || ''}</span>${this.insereEspaco(qtEspacoDadosMotorista)}
            <span>CPF: ${data[0].G031_CJMOTORI || ''}</span>${this.insereEspaco(qtEspacoDadosVeiculo)}
            <span>Veiculo: ${data[0].G032_NRFROTA || ''}</span>${this.insereEspaco(1)}
            <span>Placa: ${data[0].G032_NRPLAVEI || ''}</span>${this.insereEspaco(1)}
            <span>Renavam:${data[0].G032_DSRENAVA || ''}</span>
            <br>
            ${hrManifesto}
            <span>Emp</span>&nbsp;
            <span>Conhec </span>
            <span>Remetente</span>${this.insereEspaco(10)}
            <span>Destinatario</span>${this.insereEspaco(7)}
            <span>Cidade</span>${this.insereEspaco(6)}
            <span>UF </span>
            <span>Notas</span>${this.insereEspaco(24)}
            <span>Peso</span>${this.insereEspaco(5)}
            <span>Vr Nota</span>${this.insereEspaco(2)}
            <span>Vr Prest</span>${this.insereEspaco(2)}
            <span>Ord </span>
            <br>
            ${hrManifesto}
          `;

          this.conteudoManifesto += `
            <div style="font-weight: bolder;">
              ${hrManifesto}
              <span>${data[0].G028_NMARMAZE}</span>${this.insereEspaco(qtEspacoCabecalho)}<span>BRAVO</span>${this.insereEspaco(26)}<span>RLC014</span>
              <br>
              <span>MANIFESTO DE CARGA</span>${this.insereEspaco(82)}<span>${this.getDtHoraAtual()}</span>${this.insereEspaco(4)}<span>PAG. 0001</span>
              <br>
              ${dadosCarga}
          `;

          for (let i in data) {
            this.conteudoManifesto += `
              <span>${this.insereZeros(4 - parseInt(data[i].G024_IDTRANSP.toString().length))}${data[i].G024_IDTRANSP} </span>
              <span>${data[i].G051_CDCTRC}</span>${this.insereEspaco(6 - parseInt(data[i].G051_CDCTRC.toString().length))}
              <span>${data[i].G005RE_NMCLIENT.toUpperCase().substr(0, 19).trim()}</span>${this.insereEspaco(19 - parseInt(data[i].G005RE_NMCLIENT.substr(0, 19).trim().length))}
              <span>${data[i].G005DE_NMCLIENT.toUpperCase().substr(0, 19).trim()}</span>${this.insereEspaco(19 - parseInt(data[i].G005DE_NMCLIENT.substr(0, 19).trim().length))}
              <span>${data[i].G003DE_NMCIDADE.toUpperCase().substr(0, 12).trim()}</span>${this.insereEspaco(12 - parseInt(data[i].G003DE_NMCIDADE.substr(0, 12).trim().length))}
              <span>${data[i].G002DE_CDESTADO.toUpperCase()} </span>
              <span>${data[i].G083_NRNOTA.substr(0, 23).trim()}</span>
              ${this.insereEspaco(32 - (parseInt(data[i].G083_NRNOTA.substr(0, 23).trim().length) + parseInt(data[i].G051_NRPESO.length)))}
              <span>${data[i].G051_NRPESO}</span>${this.insereEspaco(12 - parseInt(data[i].G043_VRDELIVE.length))}
              <span>${data[i].G043_VRDELIVE}</span>${this.insereEspaco(10 - parseInt(data[i].G051_VRTOTPRE.length))}
              <span>${data[i].G051_VRTOTPRE}</span>${this.insereEspaco(2)}
              <span>${this.insereZeros(3 - parseInt(data[i].G048_NRSEQETA.toString().length))}${data[i].G048_NRSEQETA}</span>
              <br>
            `;

            if (data[i].G024CD_IDTRANSP != null && data[i].G024CD_NMTRANSP != null) {
              this.conteudoManifesto += `
                ${this.insereEspaco(11)}
                <span> >>> Crossdocking - Empresa Destino: ${this.insereZeros(4 - parseInt(data[i].G024CD_IDTRANSP.toString().length))}${data[i].G024CD_IDTRANSP} - ${data[i].G024CD_NMTRANSP}</span>
                <br>
              `;
            }

            this.conteudoManifesto += `
              ${this.insereEspaco(11)}
              <span> >>> Local de entrega: ${data[i].G005DE_NMCLIENT.toUpperCase().substr(0, 30).trim()}</span>${this.insereEspaco(30 - parseInt(data[i].G005DE_NMCLIENT.substr(0, 30).trim().length))}
              <span> End: ${data[i].G005DE_DSENDERE.toUpperCase().substr(0, 25).trim()}</span>${this.insereEspaco(25 - parseInt(data[i].G005DE_DSENDERE.substr(0, 25).trim().length))}
              <span> - ${data[i].G003DE_NMCIDADE.toUpperCase().substr(0, 12).trim()}/${data[i].G002DE_CDESTADO.toUpperCase()}</span>
              <br>
            `;

            if (parseInt(i)+1 < data.length) {
              if (data[i].G003DE_IDG003 != data[parseInt(i)+1].G003DE_IDG003) {
                this.conteudoManifesto += hrManifesto2;
              }
            } else {
              this.conteudoManifesto += `<br>`;
            }

            vlMercadorias += parseFloat(this.utilServices.desformataPeso(data[i].G043_VRDELIVE));
            vlPrestacao   += parseFloat(this.utilServices.desformataPeso(data[i].G051_VRTOTPRE));
            qtPeso        += parseFloat(this.utilServices.desformataPeso(data[i].G051_NRPESO));
          }

          let arr = this.conteudoManifesto.split('<br>');
          let arrContent = arr.slice(0, 10);
          arr = arr.slice(10, arr.length);
          let start = 0;

          if (arr.length > 0) {
            let arrAux = [];
            for (let i in arr) {
              if (((parseInt(i)+1) % 67 == 0) && (parseInt(i)+1) <= arr.length) {
                arrAux.push(arr.slice(start, parseInt(i)));
                page++;
                arrAux.push([`
                  ${hrManifesto}
                  <span>${data[0].G028_NMARMAZE}</span>${this.insereEspaco(qtEspacoCabecalho)}<span>BRAVO</span>${this.insereEspaco(26)}<span>RLC014</span>
                  <br>
                  <span>MANIFESTO DE CARGA</span>${this.insereEspaco(82)}<span>${this.getDtHoraAtual()}</span>${this.insereEspaco(4)}<span>PAG. ${this.insereZeros(4 - page.toString().length)}${page}</span>
                  <br>
                  ${dadosCarga.slice(0, dadosCarga.lastIndexOf('<br>') - 1)}
                `]);
                start = parseInt(i);
              }
            }

            if (start > 0) {
              arrAux.push(arr.slice(start, arr.length));
            }

            if (arrAux.length > 0) {
              for (let aux of arrAux) {
                arrContent = [...arrContent, ...aux];
              }
            } else {
              arrContent = [...arrContent, ...arr];
            }

            let conteudo = ``;
            if (arrContent.length > 0) {
              for (let content of arrContent) {
                conteudo += `${content}<br>`;
              }
            }

            this.conteudoManifesto = conteudo;
          }

          let txVlMercadorias = this.utilServices.formataPesoSemUnidade(vlMercadorias);
          let txVlPrestacao   = this.utilServices.formataPesoSemUnidade(vlPrestacao);
          let txQtPeso        = this.utilServices.formataPesoSemUnidade(qtPeso);

          this.conteudoManifesto += `
            <br>
            ${hrManifesto}
            <span>Quant. de Conhecimentos: ${data.length}</span>${this.insereEspaco(9 - parseInt(data.length.toString().length))}
            <span>Valor Mercadorias: ${this.insereEspaco(12 - txVlMercadorias.length)}${txVlMercadorias}</span>${this.insereEspaco(8)}
            <span>Peso: ${this.insereEspaco(10 - txQtPeso.length)}${txQtPeso}</span>${this.insereEspaco(8)}
            <span>Valor da prestação: ${this.insereEspaco(12 - txVlPrestacao.length)}${txVlPrestacao}</span>
            <br><br><br><br><br>
            <div id="msg">
              <p class="text-justify">
                ${this.insereEspaco(13)}Recebi e conferi os documentos constantes no manifesto de carga acima relacionado responsabilisando-me pelos valores neles mencionados e obrigo-me a prestar contas logo apos o meu regresso desta viagem.
              </p>
            </div>
            <br>
            <span>Malote.: 1</span>
            <br><br>
            <span>Ass.: ________________________________________ ( ) CHECKLIST ANEXO</span>
            <br><br><br>
          `;

          for (let i = 0; i < 2; i++) {
            this.conteudoManifesto += `
              <span>CTRC:_______________________________________________________________________________________________________________________________</span><br>
              <span>Recebido Filial:________________ Ass.:______________________________________________________________________________________________</span><br><br>
            `;
          }

          let arr2 = this.conteudoManifesto.split('<br>');
          if (arr2.length % 76 > 0) {
            let qtEspaco = 0;
            qtEspaco = 72 - (arr2.length % 76);

            let arrContent2 = [];
            if (qtEspaco > 0) {
              arrContent2 = arr2.slice(0, arr2.length - 7);
              arr2 = arr2.slice(arr2.length - 7, arr2.length);
              for (let i = 0; i < qtEspaco; i++) {
                arrContent2.push('');
              }
            }


            let conteudo2 = ``;
            arrContent2   = [...arrContent2, ...arr2];

            if (arrContent2.length > 0) {
              for (let content of arrContent2) {
                conteudo2 += `${content}<br>`;
              }
            }

            this.conteudoManifesto = conteudo2;
            this.conteudoManifesto += `</div>`;

          } else {
            this.conteudoManifesto += `<br><br></div>`;
          }

          this.modal.open(this.modalManifesto, { size: 'xl-2' as 'lg', windowClass: 'modal-adaptive-2' });

          $('#print-section-manifesto').append(this.conteudoManifesto);

          this.grid.loadGridHide();
        },
        err => {
          console.log('>> ERRO: <<', err);
          this.toastr.error('Falha ao carregar informações do manifesto!');
          this.grid.loadGridHide();
        }
      );
    } else {
      this.toastr.error('É necessário informar o número da carga!');
    }
  }

  printManifesto(){
    let printContents, popupWin;
    printContents = document.getElementById('print-section-manifesto').innerHTML;
    popupWin = window.open('aaaaaaa', '_blank', 'top=0,left=0,height=auto,width=100%');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>

        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

        <style type="text/css">
          body {
            font-family: 'Courier New', Courier, monospace;
          }
          #msg {
            max-width: 98%;
          }
        </style>
        <style type="text/css" media="print">
          body {
            font-family: 'Courier New', Courier, monospace;
          }
          #msg {
            max-width: 98%;
          }
        </style>
        </head>
        <body onload="window.print();window.close();" style="width: 102%; margin: 0 auto;">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  getDtHoraAtual(){
    var data = new Date();

    var dia  :any =  data.getDate();
    var mes  :any =  data.getMonth()+1;
    var ano4 :any =  data.getFullYear();
    var hor  :any =  data.getHours();
    var min  :any =  data.getMinutes();
    var seg  :any =  data.getSeconds();
    if(dia < 10){dia = '0' + dia}
    if((mes) < 10){mes = '0' + mes}
    if(hor < 10){hor = '0' + hor}
    if(min < 10){min = '0' + min}
    if(seg < 10){seg = '0' + seg}

    var str_data = dia + '/' + mes + '/' + ano4;
    var str_hora = hor + ':' + min + ':' + seg;

    return str_data + ' ' + str_hora;
  }


  mapaCarga(mpCarga){
    var obj = {}
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    //popupWin = window.open('aaaaaaa', '_blank');
    popupWin = window.open('aaaaaaa', '_blank', 'top=0,left=0,height=auto,width=100%');
    popupWin.document.open();

       if(mpCarga == true){
          obj = { "IDG046": this.cargaAtual, IDS001: localStorage.getItem('ID_USER'), "TPLOG": 1 };
          popupWin.document.write(`
            <html>
                <head>

                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
                <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

                <style type="text/css" media="print">
                    @page {
                        size: landscape;
                    }
                </style>
              </head>
              <body onload="window.print();window.close();" style="width: 98%; margin: 0 auto;">${printContents}</body>
            </html>`
          );
       }else{
        obj = { "IDG046": this.cargaAtual, IDS001: localStorage.getItem('ID_USER'), "TPLOG": 2 };
        popupWin.document.write(`
          <html>
            <head>

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>

            <style type="text/css" media="print">
                @page {
                    size: landscape;
                    scale: 0.85;

                }
            </style>
            </head>
            <body onload="window.print();window.close();" style="width: 98%; margin: 0 auto;">${printContents}</body>
          </html>`
        );
       }

      popupWin.document.close();

    this.cargaService.savePrintLog(obj).subscribe(
        data=>{
          this.mensagens.MensagemSucesso('Impressão registrada com sucesso', '');
        },
        err=>{
          this.mensagens.mensagemErroPadrao(err)
          this.grid.loadGridHide();
        }
      );
  }



  objbreadcrumbs = {}
	showGrid = false;
	viewConhecimento(obj) {

    this.conhecimentoAtual = obj.CDCTRC;
		this.idConhecimentoView = obj.IDG051;

    console.log('codigo',obj);


    this.modal.open(this.modalConhecimento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });

	 }

  controlViews = 1;





  atribuirOutrosDocumentos(obj){
    obj = JSON.parse(obj);
    console.log('opaaa', obj);

    if(obj.TPMODCAR == 1 || obj.TPMODCAR == 3){
      this.toastr.info("Inclusão disponível apenas para modelo 4PL", "Alerta!");
      return false;
    }

    if(obj.STCARGA == 'S'){
      this.grid.loadGridShow();

      this.objFormConfiguracao.reset();
      this.exibir = 5
      this.set(1,'Atribuir outros documentos', "atribuirOutrosDocumentos", null, "fa fa-plus");
      //var obj = {"IDG058": obj.IDG058};
      this.checkViewCarga = 5;



      this.cargaService.getDeliverysCarga(obj).subscribe(
        data=>{

          this.click = [];
          this.clickExistentes = [];


          for (var i = data.length - 1; i >= 0; i--) {
            //this.click.push(data[i].IDG043);
            this.click.push(data[i]);
            this.clickExistentes.push(data[i]);

          }
          this.cargaAtual = obj.IDG046;
          this.grid.loadGridHide();
        },
        err=>{
          this.grid.loadGridHide();
        }
      );


    }else{
      this.toastr.warning("Para incluir novos documentos, a carga deve estar AGENDADA" , "Alerta");
    }


  }


  openOrdemCargaNew(id){

    if(id.length <= 0){
      this.toastr.warning("Selecione ao menos um documento!", 'Alerta');
    }else{

      this.utilServices.loadGridShow();
      this.click = null;
      this.click = [];
      this.click = this.clickExistentes.map(function(item){
        return item;
      });

      console.log(this.click );

      let ids = '';
      if(id.length >= 1){
        ids = id.join();
      }else{
        ids = id;
      }

      this.cargaService.getDeliverysSelecionadasCarga(ids).subscribe(

        data=>{
          console.log('dsadoksaodksad', data);
          this.clickSelecionados = [];
          for (var i = data.length - 1; i >= 0; i--) {

            this.click.push(data[i]);
            this.clickSelecionados.push(data[i]);

          }

          this.modal.open(this.modalOrdemCarga);

          this.grid.loadGridHide();
        },
        err=>{
          this.grid.loadGridHide();
        }
      );

    }

  }



salvarReprocessarCarga(){
  console.log('kara',this.click);

  this.utilServices.loadGridShow();

  var obj = {
    grid: this.click,
    idg046:this.cargaAtual,
    new:this.clickSelecionados
  };



  this.cargaService.salvarReprocessarCarga(obj).subscribe(
  data=>{

    console.log("VOOLLTOOOOOOOOUUUUU ::::", data);

    this.filtrar();
    this.toastr.success(data.response);
    this.modal.closeModal();

    this.click = null;
    this.click = [];

    this.utilServices.loadGridHide();
    this.goHome(null);


  },
  error => {
    console.log(error);
    //this.modal.closeModal();
    this.utilServices.loadGridHide();
    this.toastr.error("Erro ao fazer a inclusão");

  });

}

 changeOptionView(opc){

    this.controlView = opc;
    this.filtrar();
  }

  asimularRota(){
		if(this.mostrarMapa){
			this.mostrarMapa = false;
		}else{
			$('#map2').css('height', '450px');
			var arParadas  = [];
			var arParaAll  = [];
			var objParadas = "";
			var objParaAll  = "";
			var objOrigem  = [this.paradasObj[0].NRLONGITOR , this.paradasObj[0].NRLATITUOR];

			objParadas += this.paradasObj[0].NRLONGITOR + "," + this.paradasObj[0].NRLATITUOR + ";";
			objParaAll += this.paradasObj[0].NRLONGITOR + "," + this.paradasObj[0].NRLATITUOR + ";";

			for (var i = 0; i < this.paradasObj.length; i++) {

				if((this.paradasObj[i].NRLONGITDE != null && this.paradasObj[i].NRLONGITDE != 0) && (this.paradasObj[i].NRLATITUDE != null && this.paradasObj[i].NRLATITUDE != 0)){

					objParadas += this.paradasObj[i].NRLONGITDE + ","+this.paradasObj[i].NRLATITUDE+";"
					arParadas[i] = [this.paradasObj[i].NRLONGITDE , this.paradasObj[i].NRLATITUDE];

					arParaAll[i] = {data:[this.paradasObj[i].NRLONGITDE , this.paradasObj[i].NRLATITUDE], empDes: false};
					objParaAll += this.paradasObj[i].NRLONGITDE + ","+this.paradasObj[i].NRLATITUDE+";"

				}
		}

			if(objParadas.length > 0){
				objParadas = objParadas.substr(0, objParadas.length - 1);
			}

			if(objParaAll.length > 0){
				objParaAll = objParaAll.substr(0, objParaAll.length - 1);
			}
			this.mostrarMapa = true;

			mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';
			var map = new mapboxgl.Map({
				container: 'map2', // container id
				style: 'mapbox://styles/mapbox/streets-v10', //stylesheet location
				center: objOrigem, //[-47.9161374,-19.7774398], // starting position
				zoom: 9 // starting zoom
			});

			var el = document.createElement('div');
			el.className = 'marker';

			map.addControl(new mapboxgl.NavigationControl());

			map.addControl(new mapboxgl.FullscreenControl());

			map.on('load', function(){
				getRoute(objParaAll, arParaAll);
			});

			function getRoute(objParaAll, arParaAll) {
				var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + objParaAll + '?steps=true&language=pt-BR&geometries=geojson&access_token=' + mapboxgl.accessToken;
				$.ajax({
					method: 'GET',
					url: directionsRequest,
				}).done(function(data){
					var route = data.routes[0].geometry;

			map.addLayer({
						id: 'route',
						type: 'line',
						source: {
							type: 'geojson',
							data: {
								type: 'Feature',
								geometry: route
							}
						},
				'layout': {
							'visibility': 'visible',
							'line-join': 'round',
							'line-cap': 'round'
				},
						paint: {
							'line-width': 2,
							'line-color': '#005bd3'
						}
					});



			map.loadImage('http://www.qas.monitoria.bravo2020.com.br/assets/images/empresa.png', function(error, image) {
				if (error) {
					console.log(error);
				throw error;
				}
				map.addImage('empresa', image);

				map.addLayer({
					id: 'start',
					type: 'symbol',
					"layout": {
					"icon-image": "empresa",
					"icon-size":0.7,
					'visibility': 'visible'
				},
				"source": {
									"type": "geojson",
									"data": {
											"type": "FeatureCollection",
											"features": [{
													"type": "Feature",
													"geometry": {
															"type": "Point",
															"coordinates": objOrigem
													}
											}]
									}
							}
				});
			});


			map.loadImage('http://www.qas.monitoria.bravo2020.com.br/assets/images/cliente.png', function(error, image) {
				if (error) {
					console.log(error);
				throw error;
				}
				map.addImage('cliente', image);

			////////debugger;
			for (var i = 0; i < arParaAll.length; i++) {
				if(!arParaAll[i].empDes){
					map.addLayer({
						id: 'end'+i,
						type: 'symbol',
						"layout": {
						"icon-image": "cliente",
						"icon-size":1.0,
						'visibility': 'visible'
					},
					"source": {
										"type": "geojson",
										"data": {
												"type": "FeatureCollection",
												"features": [{
														"type": "Feature",
														"geometry": {
																"type": "Point",
																"coordinates": arParaAll[i].data
														}
												}]
										}
								}
					});



				}else{

						map.addLayer({
							id: 'end'+i,
							type: 'symbol',
							"layout": {
							"icon-image": "empresa",
							"icon-size":0.7,
							'visibility': 'visible'
						},
						"source": {
											"type": "geojson",
											"data": {
													"type": "FeatureCollection",
													"features": [{
															"type": "Feature",
															"geometry": {
																	"type": "Point",
																	"coordinates": arParaAll[i].data
															}
													}]
											}
									}
						});
				}


				var popup = new mapboxgl.Popup({closeOnClick: false})
						.setLngLat(arParaAll[i].data)
						.setHTML('entrega '+ (i+1))
						.addTo(map);
			}

			});

				});
			}

		}

	}


  openAtribuicaoMobileCarga(obj){

    obj = JSON.parse(obj);

    if(obj.STCARGA == 'D' || obj.STCARGA == 'T'){
      this.toastr.info("Não é possivel atribuir mobile para cargas com status de Entregue ou Transporte", "Alerta!");
    }else{
      if(false /*|| obj.TPMODCAR == 2 || obj.TPMODCAR == 3*/){
        this.toastr.info("Não é possivel atribuir mobile para carga(s) 4PL", "Alerta!");
      }else{
        // if(obj.SNMOBILE == 'S'){
        //   this.toastr.info("Carga já possui atribuição mobile", "Alerta!");
        // }else{
        //   this.idCarga = obj.IDG046;
        //   this.modal.open(this.modalMobile);
        // }

          this.idCarga = obj.IDG046;
          this.snMobile = obj.SNMOBILE;
          this.modal.open(this.modalMobile);
          

      }
    }
  }


  confirmaAtribuicaoMobileCarga(){

    this.grid.loadGridShow();
    this.cargaService.atribuicaoMobileCarga(this.idCarga).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.grid.loadGridHide();
        this.filtrar();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.grid.loadGridHide();
       }
    );
  }



  openSimularRota(snUtiCid = false){
    console.log(">>>>>>>>", this.paradasObj);
    var stations  = [];

    // Caminho das imagens
    var caminhao = document.location.origin + '/assets/images/maps/caminhao.png';
    var cliente = document.location.origin + '/assets/images/maps/cliente.png';
    var empresa = document.location.origin + '/assets/images/maps/empresa.png';
    var empresaParada = document.location.origin + '/assets/images/maps/empresa-parada.png';

    if((this.paradasObj[0].NRLONGITTR != null && this.paradasObj[0].NRLONGITTR != 0) && (this.paradasObj[0].NRLATITUTR != null && this.paradasObj[0].NRLATITUTR != 0)){
      stations.push({lat: this.paradasObj[0].NRLATITUTR, lng:this.paradasObj[0].NRLONGITTR, name: 'CD Origem', icon: empresa});
    }else{
      stations.push({lat: this.paradasObj[0].NRLATITUOR, lng:this.paradasObj[0].NRLONGITOR, name: 'CD Origem', icon: empresa});
    }

    for (var i = 0; i < this.paradasObj.length; i++) {
      if((this.paradasObj[i].NRLONGITEM != null && this.paradasObj[i].NRLONGITEM != 0) && (this.paradasObj[i].NRLATITUEM != null && this.paradasObj[i].NRLATITUEM != 0)){
        stations.push({lat: this.paradasObj[i].NRLATITUEM, lng:this.paradasObj[i].NRLONGITEM, name: `Parada ${i + 1}`, icon: empresaParada});
      }else{
        if(snUtiCid){
          stations.push({lat: this.paradasObj[i].NRLATITUCI, lng:this.paradasObj[i].NRLONGITCI, name: `Parada ${i + 1}`, icon: cliente});
        }else{
          stations.push({lat: this.paradasObj[i].NRLATITUDE, lng:this.paradasObj[i].NRLONGITDE, name: `Parada ${i + 1}`, icon: cliente});
        }

      }
    }
    console.log("Paradas: ",stations);
    this.initGoogleMaps(stations);
    $('#map2').css('height', '450px');

  }


  initGoogleMaps(obj) {
    var that = this;
    var service = new google.maps.DirectionsService;
    var map = new google.maps.Map(document.getElementById('map2'), {
      //center: origin,
      zoom: 5,
      zoomControl: true,
      scaleControl: false,
      scrollwheel: true,
      disableDoubleClickZoom: false
    });

    // list of points
    var stations = obj;

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
        console.log('Dados de localização não encontrados.');
        that.openSimularRota(true);
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


  changeVisionCTRC (idg046){

    this.objFormFilter.controls['IDG046'].setValue(null);
    this.arIds = [];
    this.arIds.push({name:idg046});
    this.changeOptionView(2);

  }

  showPrintLog(mpCarga){
    let obj = {}
    if (mpCarga){
      obj = { IDG046 : this.cargaAtual, TPLOG: 1};
    }else{
      obj = { IDG046 : this.cargaAtual, TPLOG: 2};
    }

    console.log("Show Print Log");
    this.modal.open(this.modalPrintLog, { size: 'xl' as 'lg', windowClass: 'modal-adaptive-2' });
    this.cargaService.listPrintLog(obj).subscribe(
        data => {
          this.listPrintLog = data;
          this.utilServices.loadGridHide();
        },
        err => {
          this.toastr.error('Erro ao buscar as informações: '+err);
          this.utilServices.loadGridHide();
        }
      );
  }

  /* Funções relacionadas a ordem de embarque do Mapa de Expedição */

  ordens = []; //Array de objetos de ordem de embarque, sendo seus atributos a ordem em si e o destinatário dessa ordem
  //A lógica é: Se o destinatário é o mesmo, é embarcado junto(mesma ordem de embarque)
  //Isso funciona pois a ordem já vem sequenciada como o contrário do número da sequência de entregas 
  ordemEmbarque(){
    //console.log(this.objCarga);
    this.ordens = []; 
    if(this.objCarga.notas != null && this.objCarga.notas != undefined){ //Se realmente tiver notas para o mapa
      let previous = 0;

      let cDest = 1;

      for (let index = 0; index < this.objCarga.notas.length; index++) {
        if(this.objCarga.notas[index].IDDEST != previous){ //Se o destinatário da nota analisada é o mesmo da nota anterior
          this.ordens.push({ordem:cDest, id:this.objCarga.notas[index].IDDEST,
          info: {qt: 1, qvol: this.objCarga.notas[index].VRVOLUME, pliq: this.objCarga.notas[index].PSLIQUID, pbru: this.objCarga.notas[index].PSBRUTO}});//Monta o array de embarque
          
          cDest++;
          previous = this.objCarga.notas[index].IDDEST;

        }else{ //Aqui complementa as informações de um mesmo embarque(no caso do último)
          this.ordens[this.ordens.length - 1].info.qt++;
          this.ordens[this.ordens.length - 1].info.qvol += this.objCarga.notas[index].VRVOLUME;
          this.ordens[this.ordens.length - 1].info.pliq += this.objCarga.notas[index].PSLIQUID;
          this.ordens[this.ordens.length - 1].info.pbru += this.objCarga.notas[index].PSBRUTO;
        }
        
      }

      //console.log(this.ordens);

      
    }
  }

  verificaOrdem(dest){
    //Essa função é chamada no .html para retornar a ordem de embarque referente ao destinatário da nota analisada
    for (let index = 0; index < this.ordens.length; index++) {
        if(this.ordens[index].id == dest){
          return this.ordens[index].ordem;
        }
    }
  }

  validaAnterior(item){
    //Aqui é feita a "aglutinação" das notas de mesmo embarque, chamada através de um *ngIf no html
    if(item !=  this.objCarga.notas[0]){
      for (let index = 0; index < this.objCarga.notas.length; index++) {
        if(item == this.objCarga.notas[index]){
          if(item.IDDEST == this.objCarga.notas[index - 1].IDDEST){
            return false;
          }
          else{
            return true;
          }
        }
      }
    }
    return true;
  }
  
  // if(index > 0){
  //   if(this.ordens[index -1].id == this.ordens[index].id){
  //     this.aglutinador = true;
  //   }else{
  //     this.aglutinador = false;
  //   }
  // }

//Botao download documento
downloadDocumento(id) {
  var nomeArquivo = '';
  var idT014 = '';
  $('input[type="hidden"][id^="' + id + '"]').each(function (obj) {
    var arrayLinha = JSON.parse(($(this).val()));
    nomeArquivo = arrayLinha.NMANEXO;
    idT014 = arrayLinha.IDT014;
  });
  var obj = { "IDA004": id, "IDT014": idT014, IDS001: localStorage.getItem('ID_USER') };
  this.utilServices.loadGridShow();
  this.docService.downloadDocumento(obj).subscribe(
    data => {
      console.log('receipt data');
      console.log(data);
      let url = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = url;
      link.download = nomeArquivo;
      link.dispatchEvent(new MouseEvent('click'));
      this.grid.findDataTable('idDataGridFiles','objFormMotoritas');
      this.utilServices.loadGridHide();
    }, err => {
      this.toastr.error('Não foi possível realizar a operação');
      this.utilServices.loadGridHide();
    }
  )
}

}
