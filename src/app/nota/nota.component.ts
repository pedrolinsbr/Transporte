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
import { ConhecimentoService } from '../services/geral/conhecimento.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../services/globals.services';

@Component({
  selector: 'app-nota',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.scss']
})
export class NotaComponent implements OnInit {
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
  urlCargaGrid        = this.apiUrl+'tp/nota/listar';
  url = this.global.getApiHost();
  idCargaView = 0;
  idConhecimentoView = 0;
  advancedFilter:boolean = false;

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  arIdsCarga = [];
  arIdsIDG043  = [];
  arIdsCDDELIVE  = [];
  arIdsNrNota  = [];
  arIdsCDG46ETA= [];
  arIdsG024at  = [];

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
        STDELIVE    : [], // STATUS DELIVERY
        STETAPA     : [],
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
        DTDELIVE    : [],
        G043_IDG005DE: [],
        G043_IDG005RE: [],
        G043_IDG005RC: [],
        G051_IDG024  : [],
        G024AT_IDG024: [],
        G043_IDG043  : [],
        G043_CDDELIVE: [],
        SNLIB        : [],
        STINTCLI     : [],
        dtEntrega    : [],
        SNLIBMONT    :[]
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
  IdsG043 = {in:[]};
  IdsCDDELIVE = {in:[]};
  IdsCDG46ETA = {in:[]};
  IdsNrNota = {in:[]};
  IdsStatusDelive = {in:[]};
  IdsStatusEtapa = {in:[]};
  IdsStatusOpera = {in:[]};
  filtrar(){
    //debugger
    this.IdsG043 = {in:[]};
    this.IdsCDDELIVE = {in:[]};
    this.IdsCDG46ETA = {in:[]};
    this.IdsNrNota = {in:[]};
    this.IdsStatusDelive = {in:[]};
    this.IdsStatusEtapa = {in:[]};
    this.IdsStatusOpera = {in:[]};
    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        this.IdsG043.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G043_IDG043']= this.IdsG043;
    }else{
      objfilterAux['G043_IDG043'] = null;
    }

    if(this.arIdsCDDELIVE.length > 0 ){
      for(let i of this.arIdsCDDELIVE){
        this.IdsCDDELIVE.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G043_CDDELIVE'] = this.IdsCDDELIVE;
    }else{
      objfilterAux['G043_CDDELIVE'] = null;
    }

    if(this.arIdsNrNota.length > 0 ){
      for(let i of this.arIdsNrNota){
        this.IdsNrNota.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G043_NRNOTA'] = this.IdsNrNota;
    }else{
      objfilterAux['G043_NRNOTA'] = null;
    }

    if(this.arIdsCDG46ETA.length > 0 ){
      for(let i of this.arIdsCDG46ETA){
        this.IdsCDG46ETA.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['G043_CDG46ETA']= this.IdsCDG46ETA;
    }else{
      objfilterAux['G043_CDG46ETA'] = null;
    }

    if(this.objFormFilter.controls['G043_IDG005RE'].value != null && this.objFormFilter.controls['G043_IDG005RE'].value != undefined){
      objfilterAux['G043_IDG005RE'] = { in: this.objFormFilter.controls['G043_IDG005RE'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G043_IDG005DE'].value != null && this.objFormFilter.controls['G043_IDG005DE'].value != undefined){
      objfilterAux['G043_IDG005DE'] = { in: this.objFormFilter.controls['G043_IDG005DE'].value.map(d=>{return d.id}) };
    }

    if(this.objFormFilter.controls['G043_IDG005RC'].value != null && this.objFormFilter.controls['G043_IDG005RC'].value != undefined){
      objfilterAux['G043_IDG005RC'] = { in: this.objFormFilter.controls['G043_IDG005RC'].value.map(d=>{return d.id}) };
    }
  
    if(objfilterAux['STDELIVE'].length > 0 ){
      for(let i of objfilterAux['STDELIVE']){
        this.IdsStatusDelive.in.push(i.id)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['STDELIVE']= this.IdsStatusDelive;
    }else{
      objfilterAux['STDELIVE'] = null;
    }

    if(objfilterAux['STETAPA'].length > 0 ){
      for(let i of objfilterAux['STETAPA']){
        this.IdsStatusEtapa.in.push(i.id)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      objfilterAux['STETAPA']= this.IdsStatusEtapa;
    }else{
      objfilterAux['STETAPA'] = null;
    }
    

    // if(this.arIdsNrchadoc.length > 0 ){
    //   for(let i of this.arIdsNrchadoc){
    //     idsNrChadoc.push(i.name);
    //   }
    //   objfilterAux.G051_NRCHADOC = {in: idsNrChadoc};
    // }else{
    //   objfilterAux.G051_NRCHADOC = null;
    // }

    this.objfilter.value = objfilterAux
    this.grid.findDataTable('delivery', 'objfilter');
  }
  limpar(){
    this.objFormFilter.reset();
    this.grid.findDataTable('delivery');

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

    
    this.objFormFilter.value.STDELIVE = event;
    if(this.objFormFilter.value.STDELIVE == ""){
      this.objFormFilter.value.STDELIVE = {"in":['C','R','D']};
    }

    this.objFormFilter.value.STETAPA = event;
    if(this.objFormFilter.value.STETAPA == ""){
      this.objFormFilter.value.STETAPA = {"in":['0','1','2','3','4','5','6','7','8','20','22','23','24']};
    }
    this.grid.findDataTable('delivery');
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

  viewConhecimento(id) {

    this.idConhecimentoView = id;
    this.modal.open(this.modalConhecimento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }


}
