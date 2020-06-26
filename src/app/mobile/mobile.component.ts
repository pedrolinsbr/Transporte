// ##### IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

// ##### COMPONENTES
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

// ##### SERVICES
import { MobileService } from './../services/geral/mobile.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../services/globals.services';

import { InfoParadas } from '../shared/componentesbravo/src/app/models/info-paradas.model';

import { DeliverysNewService } from '../shared/componentesbravo/src/app/services/crud/deliveryNew.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { isArray } from 'util';
declare var google: any;

@Component({
  selector: 'app-mobile',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalCarga') modalCarga: any;
  @ViewChild('modalCanhoto') modalCanhoto: any;
  @ViewChild('modalVeiculo') modalVeiculo: any;
  @ViewChild('modalMotorista') modalMotorista: any;
  @ViewChild('modalMapa') modalMapa: any;

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "dePara";
  urlMobileGrid       = this.apiUrl+'tp/mobile/listar';
  url = this.global.getApiHost();
  idMobileView = 0;
  paradasObj: InfoParadas[];

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  dadosCabecalho   = [];
  arIdsMobile = [];
  arIds = [];
  arIdCtrc = [];
  arIdCarLog = [];
  objfilter = {value:null};
  dadosCanhoto = null;

  objStyle             = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

  // ##### ID's
  idMobile             = null;
  indicadores = {
    url: this.url + "tp/mobile/indicadores"
  }

  // ##### VALIDATORS
  checkViewMobile      = 0;
  collappsed          = null;
  exibir              = 1;
  checkViewCarga      = 0;
  idCargaView = 0;

  public errorFound: boolean = false;
  public isSearched: boolean = false;
  advancedFilter:boolean = false;

  cargaObj: any;//InfoCarga;
  arrRestricoes = [];
  arRotas = [];

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
  objFormDesmMobile    : FormGroup;

  // ##### MODAL
  modalRef: NgbModalRef;

    constructor(
      private mensagens     : MensagensComponent,
      private mobileService : MobileService,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private utilServices  : UtilServices,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      public  translate     : TranslateService,
      private modalService  : NgbModal,
      public  vRef          : ViewContainerRef,
      public deliveryService: DeliverysNewService,
    )
    {

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({
        STCARGA  : [], // STATUS CARGA
        IDG046   : [], // ID CARGA
        IDG030   : [], // ID TIPO DE VEÍCULO
        IDG031   : [], // ID MOTORISTA
        IDG032   : [], // ID VEÍCULO
        IDS001   : [], // ID USUÁRIO
        IDG024   : [], // ID TRANSPORTADORA
        IDG028   : [], // ARMAZÉM DE COLETA
        DTCARGA  : [], // DATA CARGA
        DTSAICAR : [], // DATA SAÍDA CARGA
        DTPSMANU : [], // PREVIÃO DE SAÍDA CARGA
        SNCARPAR : [], // CARGA PARCIAL (S/N)
        STCADAST : [], // SITUAÇÃO DE 
        G051_CDCTRC   : [], // CODIGO CTRC
        G046_IDCARLOG   : [], // ID CARGA LOGOS
        SNDESLOG:[], // CARGA DESCIDA PARA LOGOS
        // IDG005RE : [],
        // IDG005DE : [],
        IDG032V1 : [], //ID VEICULO 1
        IDG031M1 : [], // ID MOTORISTA 1 
        G046_SNVIRA: [],
        S001GF_NMUSUARI: [],//Gestor de frota

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

      });

      // ##### DESMONTAR CARGAS
      this.objFormDesmMobile = formBuilder.group({
        EMPREDES : ['', [Validators.required]],
        EMPRECON : [],
        IDG043   : [],
        IDG051   : []
      });
    }


    ngOnInit() {
      this.objFormConfiguracao;
      this.getDadosCabecalhoMobile();
    }

    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
      }
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

  addMobile(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + this.breadcrumbs.home, "addMobile", null, "fa fa-plus");
    this.checkViewMobile = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewMobile(id) {
    // this.objFormConfiguracao.reset();
    // this.exibir = 2
    // this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + this.breadcrumbs.home, "viewMobile", null, "fa fa-plus");
    // var obj = {"IDG058": id};
    // this.checkViewMobile = 1;
    this.idMobileView = id;
    this.modal.open(this.modalCarga, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  getDadosCabecalhoMobile() {
    this.mobileService.qtdSituacaoMobile().subscribe(
      data => {
        this.dadosCabecalho = data[0];
        // for (let r = 0; r < data.length; r++) {
        //   this.dadosCabecalho[data[r].STCARGA] = data[r].QTD;
        // }
        // console.log(this.dadosCabecalho);
      },
      err => {
        this.errorFound = true; // - Controller Error.
      }
    );
  }

  updateMobile(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + this.breadcrumbs.home, "updateMobile", null, "fa fa-plus");
    var obj = {"IDG058": id};
    this.checkViewMobile = 2;
  }



  //##############################



//   openDelete(obj){
  
//     obj = JSON.parse(obj);

    
//     if(obj.STCARGA == 'C'){
//       this.toastr.warning("Mobile já cancelada!", obj.IDG046);
//     }else{


//     if(!obj.DTPSMANU){
//       this.toastr.warning("É possivel efetuar o cancelamento apenas de mobiles 3PL", obj.IDG046);
//     }else{
//       this.idMobile = obj.IDG046;
//       this.modal.open(this.modalDelete);

//     }
//   }
// }

  // deleteMobile(ids){
    
  //   if(ids.length == 0){
  //     this.toastr.warning("Selecione no mínimo uma mobile");
  //   }else{
  //     this.grid.loadGridShow();
  //     this.mobileService.validaCancelar({IDG046S: ids}).subscribe(
  //       data=>{
  //         if(data.QTD == 0){
  //           this.idMobile = ids;
  //           this.modal.open(this.modalDelete);
  //         }else{
  //           this.toastr.error("Não é possivel cancelar mobile(s)");
  //         }
  //         this.grid.loadGridHide();
  //       }
  //     );

  //   }
  // }

  close(){
    this.modal.closeModal();
  }


  // confirmaDeleteMobile(){
  //   this.grid.loadGridShow();
  //   this.mobileService.deleteMobile(this.idMobile).subscribe(
  //     data => {
  //       this.find(this.idDataGrid);
  //       this.mensagens.MensagemSucesso(data.response, '');
  //       this.close();
  //       this.grid.loadGridHide();
  //       this.filtrar();
  //     },
  //     err => {
  //       this.mensagens.mensagemErroPadrao(err);
  //       this.grid.loadGridHide();
  //      }
  //   );
  // }
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
    
    this.Ids = {in:[]};
    this.IdCrtc = {in:[]};
    this.IdCarLog = {in:[]};
    let objfilterAux = Object.assign({}, this.objFormFilter.value);
    var arrayIdsVeicul = []
    var arrayIdsMotor = []
    
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
    if(objfilterAux.IDG032V1.length > 0){
      for(let objVeiculos of objfilterAux.IDG032V1){
      arrayIdsVeicul.push(objVeiculos.id);
      }
      objfilterAux.IDG032V1 = {in: arrayIdsVeicul}
    }else{
      objfilterAux.IDG032V1 = null;
    }

    //Combobox Multiplos de Motoristas
    if(objfilterAux.IDG031M1.length > 0){
      for(let objMotoristas of objfilterAux.IDG031M1){
        arrayIdsMotor.push(objMotoristas.id);
      }
      objfilterAux.IDG031M1 = {in: arrayIdsMotor}
    }else{
      objfilterAux.IDG031M1 = null;
    }

    this.objfilter.value = objfilterAux
    this.grid.findDataTable('mobile','objfilter');
  }
  limpar(){
    this.objFormFilter.reset();
    this.arIds = [];
    this.grid.findDataTable('mobile');

  }
  //##############################

  // atriMotorista(obj){
  //   let objAux = JSON.parse(obj);
    
  //   // debugger;
  //   if(objAux.STCARGA == 'F' || objAux.STCARGA == 'A' || objAux.STCARGA == 'S'){
  //     let id = objAux.IDG046;
  //     this.set(1, "Atribuir Motorista", "atriMotorista", obj, "fa fa-plus");
  //     this.objFormMotoritas.controls['IDG024'].setValue({id: objAux.IDG024 , text: objAux.NMTRANSP });
  //     this.objFormMotoritas.controls['IDG046'].setValue(objAux.IDG046);

  //     if(objAux.DTPSMANU){
  //       this.objFormMotoritas.controls['DTPRESAI'].setValue(this.utilServices.getDateObjFromString(objAux.DTPSMANU));
        
  //       let hora = this.utilServices.dataTimeDG(objAux.DTPSMANU).split(" ")[1].split(':');
        
  //       this.objFormMotoritas.controls['DTPRESAIH'].setValue({hour: hora[0], minute: hora[1]});
  //     }

  //     if(objAux.IDG032V1){
  //       this.objFormMotoritas.controls['IDG032V1'].setValue({id: objAux.IDG032V1 , text: objAux.DSVEICULV1 , idg030: objAux.IDG030 });
  //     }
  //     if(objAux.IDG031M1){
  //       this.objFormMotoritas.controls['IDG031M1'].setValue({id: objAux.IDG031M1 , text: objAux.NMMOTORI1 });
  //     }

  //     if(objAux.IDG032V2){
  //       this.objFormMotoritas.controls['IDG032V2'].setValue({id: objAux.IDG032V2 , text: objAux.DSVEICULV2, idg030: objAux.IDG030 });
  //     }
  //     if(objAux.IDG031M2){
  //       this.objFormMotoritas.controls['IDG031M2'].setValue({id: objAux.IDG031M2 , text: objAux.NMMOTORI2 });
  //     }

  //     if(objAux.IDG032V3){
  //       this.objFormMotoritas.controls['IDG032V3'].setValue({id: objAux.IDG032V3 , text: objAux.DSVEICULV3, idg030: objAux.IDG030 });
  //     }
  //     if(objAux.IDG031M3){
  //       this.objFormMotoritas.controls['IDG031M3'].setValue({id: objAux.IDG031M3 , text: objAux.NMMOTORI3 });
  //     }

  //     // this.getMotoristas(id);
  //     this.exibir = 3;
  //   }else{
  //     this.toastr.error("Não é possível atribuir para mobile(s) com esse status!");
  //   }

  // }

  // getMotoristas(id){
  
  // }

  saveMotorista(){
    this.grid.loadGridShow();
    if(this.validaFormularioValido(this.objFormMotoritas)){
      this.mobileService.atriVeiculoMotorista(this.objFormMotoritas.value).subscribe(
        data=>{
          this.toastr.success('Atribuição realizada com sucesso!');
          this.goHome(null);
          this.grid.loadGridHide();
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

  // desmontarMobile(ar){
  //   this.objFormDesmMobile.reset();
    
  //   this.arIdsMobile = ar;
  //   if(ar.length == 0){
  //     this.toastr.warning("Selecione no mínimo uma mobile");
  //   }else{
  //     var json;
  //     let selecionados = [];
  //     $($('input[type="hidden"][name^="obj_checkbox_mobile_').parent()).each(function (obj) {
  //       if($($(this).children()[0]).prop("checked")){
  //         json  = JSON.parse($($(this).children()[1]).val());
  //         selecionados.push(json);
  //       }
  //     });
      
  //     let validaStatus = true;
  //     for(let item of selecionados){
  //       if(item.STCARGA != 'T' && item.STCARGA != 'S' && item.STCARGA != 'F'){
  //         validaStatus = false;
  //       }
  //     }
  //     if(validaStatus){
  //       this.exibir = 4;
  //       this.set(1, "Desmontar Mobile(s)", "desmontarMobile", ar, "fas fa-boxes");
  //     }else{
  //       this.toastr.warning("É possivel desmontar Mobile(s) com status (Agendada e Transporte)");
  //     }
  //   }
  // }
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
  // saveDesmontarMobile(){


  //   this.objFormDesmMobile.controls['IDG043'].setValue([]);
  //   this.objFormDesmMobile.controls['IDG051'].setValue([]);

  //   let view1 = 'input[type="hidden"][name^="obj_checkbox_gridMobiles1_"]';
  //   let view2 = 'input[type="hidden"][name^="obj_checkbox_gridMobiles2_"]';

  //   this.objFormDesmMobile.controls['IDG043'].setValue(this.getChecados(view1).IDG043);
  //   this.objFormDesmMobile.controls['IDG051'].setValue(this.getChecados(view2).IDG051);

  //   if(this.validaFormularioValido(this.objFormDesmMobile)){
    
  //     // if(this.objFormDesmMobile.controls['IDG043'].value.length != 0 || this.objFormDesmMobile.controls['IDG051'].value.length != 0){
  //     if(this.objFormDesmMobile.controls['IDG051'].value.length != 0){

        
  //       this.mobileService.desmontarMobile(this.objFormDesmMobile.value).subscribe(
  //         data=>{
  //           this.toastr.success("Mobile desmontada com sucesso!");
  //           this.find('mobile');
  //           this.goHome(null);
  //         },
  //         err=>{

  //         }
  //       );
  //     }else{
  //       this.toastr.warning("Selecione no mínimo um documento!");
  //     }
  //   }else{
  //     var res = null;
  //     res = this.translate.get('it.erro.formIncompleto');
  //     this.toastr.error(res.value);
  //   }
  // }

  filtrarIndi(event){
    
    this.objFormFilter.value.STCARGA = event;
    if(this.objFormFilter.value.STCARGA == ""){
      this.objFormFilter.value.STCARGA = {"in":['R','O','X','A','S','T','C','E','F']};
    }
    this.grid.findDataTable('mobile');
  }

  openModalVeiculo(){
    this.modal.open(this.modalVeiculo, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  openModalMototrista(){
    this.modal.open(this.modalMotorista, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  objMobile = {};
  dtHrAtual:any;
  // openMapaMobile(obj){
  //   obj = JSON.parse(obj);
    
  //   if(obj.DTPSMANU == null){
  //     this.toastr.info("Mapa de mobile disponível apenas para modelo 3PL", "Alerta!");
  //     return false;
  //   }

  //   if(obj.STCARGA == 'S' || obj.STCARGA == 'A' || obj.STCARGA == 'F'){
  //     this.grid.loadGridShow();
  //     this.dtHrAtual = this.getDtHoraAtual();
  //     this.mobileService.getMapaMobile(obj).subscribe(
  //       data=>{
          
  //         this.modal.open(this.modalMapa, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  //         this.objMobile = data;
  //         this.grid.loadGridHide();
  //       },
  //       err=>{
  //         this.grid.loadGridHide();
  //       }
  //     );
  //   }else{
  //     this.toastr.warning("Impossível gerar mapa de mobiles nesse status", "Alerta");
  //   }


  // //  this.mapaMobile();
  // }

  // getDtHoraAtual(){
  //   var data = new Date();

  //   var dia  :any =  data.getDate();
  //   var mes  :any =  data.getMonth();
  //   var ano4 :any =  data.getFullYear();
  //   var hor  :any =  data.getHours();
  //   var min  :any =  data.getMinutes();
  //   var seg  :any =  data.getSeconds();
  //   if(dia < 10){dia = '0' + dia}
  //   if((mes+1) < 10){mes = '0' + (mes+1)}
  //   if(hor < 10){hor = '0' + hor}
  //   if(min < 10){min = '0' + min}
  //   if(seg < 10){seg = '0' + seg}

  //   var str_data = dia + '/' + mes + '/' + ano4;
  //   var str_hora = hor + ':' + min + ':' + seg;

  //   return str_data + ' ' + str_hora;
  // }

  // mapaMobile(){
  //   // this.objMobile = JSON.parse(obj);
  //       let printContents, popupWin;
  //      printContents = document.getElementById('print-section').innerHTML;
  //      //popupWin = window.open('aaaaaaa', '_blank');
  //      popupWin = window.open('aaaaaaa', '_blank', 'top=0,left=0,height=auto,width=100%');
  //      popupWin.document.open();
  //      popupWin.document.write(`
  //        <html>
  //           <head>

  //           <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  //           <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  //           <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
  //           <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
            
  //           <style type="text/css" media="print">
  //               @page { 
  //                   size: landscape;
  //               }
  //           </style>  
  //          </head>
  //          <body onload="window.print();window.close();" style="width: 98%; margin: 0 auto;">${printContents}</body>
  //        </html>`
  //      );
  //      popupWin.document.close();
  // }


  viewCarga(id) {

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


  viewCanhoto(obj) {
    console.log('lll',obj.QTNOTCAN);
    if(obj.QTNOTCAN > 0){
      this.dadosCanhoto = null;    
      this.deliveryService.getInformacoesCanhoto(obj).subscribe(
        data => {
          this.dadosCanhoto = data;
        },
        err => {
          this.errorFound = true; // - Controller Error.
        }
      );
      this.modal.open(this.modalCanhoto, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
    }else{
      this.toastr.info("Anexo indisponível", "Alerta!");
    }
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



}
