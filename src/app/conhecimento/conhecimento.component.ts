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
import { ConhecimentoService } from './../services/geral/conhecimento.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../services/globals.services';
import * as moment from 'moment';

@Component({
  selector: 'app-conhecimento',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './conhecimento.component.html',
  styleUrls: ['./conhecimento.component.scss']
})
export class ConhecimentoComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalAlteraPrev') modalAlteraPrev: any;
  @ViewChild('modalConhecimento') private modalConhecimento;

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "dePara";
  urlCargaGrid        = this.apiUrl+'tp/conhecimento/listar';
  url = this.global.getApiHost();
  idCargaView = 0;
  conhecimentoAtual = "";
  idConhecimentoView = 0;
  advancedFilter:boolean = false;

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  arIdsCarga = [];
  arIdsIDG043  = [];
  arIdsIDG051  = [];
  arIdsNrNota  = [];
  arIdsNrchadoc= [];
  arIdsG024at  = [];
  arIdsNrConhec= [];
  arIdsCDDELIVE = [];
  arIdsIDG046 = [];


  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

  // ##### ID's
  idCarga             = null;
  indicadores = {
    url: this.url + "tp/carga/indicadores",
    cardsNum:[0,1,2]
  }

  // ##### VALIDATORS
  checkViewCarga      = 0;
  collappsed          = null;
  exibir              = 1;
  objfilter = {value:null};
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

  // ##### MODAL
  modalRef: NgbModalRef;

    constructor(
      private mensagens     : MensagensComponent,
      private cargaService  : ConhecimentoService,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private utilServices  : UtilServices,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      public  translate     : TranslateService,
      private modalService  : NgbModal,
      public  vRef          : ViewContainerRef
    )
    {

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({
        // STCARGA  : [], // STATUS CARGA
        // IDG046   : [], // ID CARGA
        // IDG030   : [], // ID TIPO DE VEÍCULO
        // IDG031   : [], // ID MOTORISTA
        // IDG032   : [], // ID VEÍCULO
        // IDS001   : [], // ID USUÁRIO
        // IDG024   : [], // ID TRANSPORTADORA
        // IDG028   : [], // ARMAZÉM DE COLETA
        // DTCARGA  : [], // DATA CARGA
        // DTSAICAR : [], // DATA SAÍDA CARGA
        // DTPRESAI : [], // PREVIÃO DE SAÍDA CARGA
        // SNCARPAR : [], // CARGA PARCIAL (S/N)
        // STCADAST : [], // SITUAÇÃO DE CADASTRO
        // IDG005RE : [],
        // IDG005DE : [],
        G051_IDG005DE: [],
        G051_IDG005RE: [],
        G051_IDG005RC: [],
        G051_IDG005CO: [],
        G051_IDG005EX: [],
        G051_IDG024  : [],
        G024AT_IDG024: [],
        G052_IDG043  : [],
        G051_CDCTRC  : [],
        SNLIB        : [],
        STINTCLI     : [],
        dtEntrega    : [],
        SNLIBMONT    : [],
        dtEntCon     : [],
        G043_CDDELIVE: [],
        G048_IDG046  : [],
        DTEMICTR     : [],
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

        IDG024    : [],
        DTPREV    : [],
        HRPREV    : [],

        //VEICULOS
        VEICULO1  : [],
        VEICULO2  : [],
        VEICULO3  : [],
        VEICULO4  : [],

        //MOTORITAS
        MOTORISTA1: [],
        MOTORISTA2: [],
        MOTORISTA3: [],
        MOTORISTA4: []

      });

      // ##### DESMONTAR CARGAS
      this.objFormDesmCarga = formBuilder.group({
        IDI015   : [],
        IDG043   : [],
        IDG051   : [],
        DTENTREG : [],
        DTENTPLA : []
      });
    }


    ngOnInit() {
      this.objFormConfiguracao;
      moment.locale('pt-BR');
      let data = moment();
      let aux1 = data.format('L');
      let aux2 = data.subtract(60, 'days').format('L');
  
      let auxB = aux2.split("/");
      let auxA = aux1.split("/");
      
      this.objFormFilter.controls['DTEMICTR'].setValue( 
        { endDate : {year: auxA[2], month: parseInt(auxA[1]), day: parseInt(auxA[0])}, 
          beginDate   : {year: auxB[2], month: parseInt(auxB[1]), day: parseInt(auxB[0])},
        formatted : aux2+" - "+aux1 } );
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

  addCarga(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + this.breadcrumbs.home, "addCarga", null, "fa fa-plus");
    this.checkViewCarga = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewCarga(id) {
    // this.objFormConfiguracao.reset();
    // this.exibir = 2
    // this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + this.breadcrumbs.home, "viewCarga", null, "fa fa-plus");
    // var obj = {"IDG058": id};
    // this.checkViewCarga = 1;
    this.idCargaView = id;
  }

  updateCarga(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + this.breadcrumbs.home, "updateCarga", null, "fa fa-plus");
    var obj = {"IDG058": id};
    this.checkViewCarga = 2;
  }



  //##############################



  openDelete(id){
    this.idCarga = id;
    this.modal.open(this.modalDelete);
  }

  deleteCarga(ids){
    
    if(ids.length == 0){
      this.toastr.warning("Selecione no mínimo uma carga");
    }else{
      this.grid.loadGridShow();
      // this.cargaService.validaCancelar({IDG046: ids}).subscribe(
      //   data=>{
      //     if(data.QTD == 0){
      //       this.idCarga = ids;
      //       this.modal.open(this.modalDelete);
      //     }else{
      //       this.toastr.error("Não é possivel cancelar carga(s)");
      //     }
      //     this.grid.loadGridHide();
      //   }
      // );

    }
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteCarga(){
    // this.cargaService.deleteCarga(this.idCarga).subscribe(
    //   data => {
    //     this.find(this.idDataGrid);
    //     this.mensagens.MensagemSucesso(data.response, '');
    //     this.close();
    //   },
    //   err => {
    //     this.mensagens.mensagemErroPadrao(err);
    //    }
    // );
  }
  //##############################




  //########## DATAGRID ##########
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
  IdsG043 = [];
  IdsG051 = [];
  IdsNrChadoc = [];
  IdsNrNota = [];
  IdsNrConhec = [];
  idsDELIVE =[];
  idsCARGA =[];

  filtrar(){
    
    this.IdsG043 = [];
    this.IdsG051 = [];
    this.IdsNrChadoc = [];
    this.IdsNrNota = [];
    this.IdsNrConhec = [];
    this.idsDELIVE = [];
    this.idsCARGA = [];
    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        this.IdsG043.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      //{in: idsDELIVE}
      objfilterAux['G052_IDG043']= {in: this.IdsG043};
    }else{
      objfilterAux['G052_IDG043'] = null;
    }

    if(this.arIdsIDG051.length > 0 ){
      for(let i of this.arIdsIDG051){
        this.IdsG051.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G051_CDCTRC'] = {in: this.IdsG051};
    }else{
      objfilterAux['G051_CDCTRC'] = null;
    }

    if(this.arIdsNrNota.length > 0 ){
      for(let i of this.arIdsNrNota){
        this.IdsNrNota.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G043_NRNOTA'] = {in: this.IdsNrNota};
    }else{
      objfilterAux['G043_NRNOTA'] = null;
    }

    if(this.arIdsNrchadoc.length > 0 ){
      for(let i of this.arIdsNrchadoc){
        this.IdsNrChadoc.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G051_NRCHADOC']= {in: this.IdsNrChadoc};
    }else{
      objfilterAux['G051_NRCHADOC'] = null;
    }
    
    
    if(this.arIdsNrConhec.length > 0 ){
      for(let i of this.arIdsNrConhec){
        this.IdsNrConhec.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G051_IDG051']= {in: this.IdsNrConhec};
    }else{
      objfilterAux['G051_IDG051'] = null;
    }

    //CODIGO DA DELIVERY
    if(this.arIdsCDDELIVE.length > 0 ){
      for(let i of this.arIdsCDDELIVE){
        this.idsDELIVE.push(i.name);
      }
      objfilterAux.G043_CDDELIVE = {in: this.idsDELIVE};
    }else{
      objfilterAux.G043_CDDELIVE = null;
    }

    if(this.arIdsIDG046.length > 0 ){
      for(let i of this.arIdsIDG046){
        this.idsCARGA.push(i.name);
      }
      objfilterAux.G048_IDG046 = {in: this.idsCARGA};
    }else{
      objfilterAux.G048_IDG046 = null;
    }

    if(this.objFormFilter.controls['G051_IDG024'].value != null && this.objFormFilter.controls['G051_IDG024'].value != undefined){
      objfilterAux['G051_IDG024'] = { in: this.objFormFilter.controls['G051_IDG024'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G024AT_IDG024'].value != null && this.objFormFilter.controls['G024AT_IDG024'].value != undefined){
      objfilterAux['G024AT_IDG024'] = { in: this.objFormFilter.controls['G024AT_IDG024'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G051_IDG005RE'].value != null && this.objFormFilter.controls['G051_IDG005RE'].value != undefined){
      objfilterAux['G051_IDG005RE'] = { in: this.objFormFilter.controls['G051_IDG005RE'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G051_IDG005DE'].value != null && this.objFormFilter.controls['G051_IDG005DE'].value != undefined){
      objfilterAux['G051_IDG005DE'] = { in: this.objFormFilter.controls['G051_IDG005DE'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G051_IDG005RC'].value != null && this.objFormFilter.controls['G051_IDG005RC'].value != undefined){
      objfilterAux['G051_IDG005RC'] = { in: this.objFormFilter.controls['G051_IDG005RC'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G051_IDG005EX'].value != null && this.objFormFilter.controls['G051_IDG005EX'].value != undefined){
      objfilterAux['G051_IDG005EX'] = { in: this.objFormFilter.controls['G051_IDG005EX'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G051_IDG005CO'].value != null && this.objFormFilter.controls['G051_IDG005CO'].value != undefined){
      objfilterAux['G051_IDG005CO'] = { in: this.objFormFilter.controls['G051_IDG005CO'].value.map(d=>{return d.id}) };
    }

    // if(this.objFormFilter.controls['DTEMICTR'].value != null && this.objFormFilter.controls['DTEMICTR'].value != undefined){
    //   objfilterAux['DTEMICTR'] = { in: this.objFormFilter.controls['DTEMICTR'].value.map(d=>{return d.id}) };
    // }
  
    

    
    console.log(this.objFormFilter)
    // if(this.arIdsNrchadoc.length > 0 ){
    //   for(let i of this.arIdsNrchadoc){
    //     idsNrChadoc.push(i.name);
    //   }
    //   objfilterAux.G051_NRCHADOC = {in: idsNrChadoc};
    // }else{
    //   objfilterAux.G051_NRCHADOC = null;
    // }

    this.objfilter.value = objfilterAux;
    this.grid.findDataTable('carga', 'objfilter');
  }
  limpar(){
    this.objFormFilter.reset();
    this.grid.findDataTable('carga');

  }
  //##############################

  atriMotorista(id){
    this.set(1, "Atribuir Motorista", "atriMotorista", id, "fa fa-plus");
    this.getMotoristas(id);
    this.exibir = 3;
  }

  getMotoristas(id){
    //console.log("Busca Morotistas");
  }

  saveMotorista(){
    //console.log("SALVAR::: ", this.objFormMotoritas.value);

  }

  /*desmontarCarga*/alterarData(ar){
    this.objFormDesmCarga.reset();
    //debugger;
    
    this.arIdsCarga = ar;
    if(ar.length == 0){
      this.toastr.warning("Selecione no mínimo uma carga");
    }else{
      this.objFormDesmCarga.controls['IDG051'].setValue(ar);
      this.exibir = 4;
      this.set(1, "Alterar Data de Entrega", "desmontarCarga", ar, "fas fa-boxes");
    }
  }
  getChecados(view){
    // debugger;
    var json;
    var that  = {IDG043:[], IDG051:[]};
    $($(view).parent()).each(function (obj) {
      if($($(this).children()[0]).prop("checked")){
        //debugger;
        
         json  = JSON.parse($($(this).children()[1]).val());
         if(json.IDG043 != null){
           that.IDG043.push(json.IDG043);
         }
        //  if(json.IDG051 != null){
        //    that.IDG051.push(json.IDG051);
        //  }
      }else{
        let varInutil = "Não faça nada com essa variavel";
      }
     });
    return that;
  }

  saveAlterarData(){
    this.objFormDesmCarga.controls['IDG043'].setValue([]);
    //this.objFormDesmCarga.controls['IDG051'].setValue([]);

    //let view1 = 'input[type="hidden"][name^="obj_checkbox_gridCargas1_"]';
    let view2 = 'input[type="hidden"][name^="obj_checkbox_gridCargas2_"]';

    this.objFormDesmCarga.controls['IDG043'].setValue(this.getChecados(view2).IDG043);
    //this.objFormDesmCarga.controls['IDG051'].setValue(this.getChecados(view2).IDG051);

    if(true){
    
      // if(this.objFormDesmCarga.controls['IDG043'].value.length != 0 || this.objFormDesmCarga.controls['IDG051'].value.length != 0){
      if(this.objFormDesmCarga.controls['IDG043'].value.length != 0){

        
        this.cargaService.atribuirData(this.objFormDesmCarga.value).subscribe(
          data=>{
            this.toastr.success("Data Alterada com Sucesso!");
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

  alterarPrevEntrega(ar){
    if(ar.length == 0){
      this.toastr.warning("Selecione no mínimo um CTRC");
    }else{
      this.objFormDesmCarga.reset();
      this.modal.open(this.modalAlteraPrev, { size: 'xl'});
      this.objFormDesmCarga.controls['IDG051'].setValue(ar);
    }
  }

  confirmaAlteraData(){
    //this.objFormDesmCarga.controls['IDI015'].setValue({text: "Não é possível entregar , motivo Roubo Em trânsito - 701", id: 701});
    this.grid.loadGridShow();
    this.cargaService.alterarPrevisaoEntrega(this.objFormDesmCarga.value).subscribe(
      data=>{
        this.grid.findDataTable('carga');
        this.grid.loadGridHide();
        this.toastr.success("Previsão de entrega alterada com sucesso");
        this.modal.closeModal();
      },
      err=>{
        this.toastr.error(err);
        this.grid.loadGridHide();
        this.modal.closeModal();
      }
    );
  }

  viewConhecimento(obj) {
    this.conhecimentoAtual = "";
    console.log(obj);
    this.idConhecimentoView = obj.IDG051;
    this.conhecimentoAtual = obj.CDCTRC;
    this.modal.open(this.modalConhecimento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }


}
