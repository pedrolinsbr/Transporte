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

@Component({
  selector: 'app-liberar-conhecimento',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './liberar-conhecimento.component.html',
  styleUrls: ['./liberar-conhecimento.component.scss']
})
export class LiberarConhecimentoComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalLibera') modalLibera: any;

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "dePara";
  urlCargaGrid        = this.apiUrl+'tp/conhecimento/listarLiberaConhecimentos';
  url = this.global.getApiHost();
  idCargaView = 0;

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  arIdsCarga    = [];
  arIdsIDG043   = [];
  arIdsIDG051   = [];
  arIdsCDCARGA  = [];
  arIdsIDG046   = [];

  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

  // ##### ID's
  idCarga             = null;


  // ##### VALIDATORS
  checkViewCarga      = 0;
  collappsed          = null;
  exibir              = 1;
  /*
    0 -
    1 - GRID CTE
    2 -
    3 - ATRIBUIR MOTORISTAS
    4 - DESMOTAR CARGAS
  */

  // ##### FORMS
  objFormFilter       : FormGroup;
  objFormLiberar      : FormGroup;


  // ##### MODAL
  modalRef: NgbModalRef;

    constructor(
      private mensagens     : MensagensComponent,
      private conhecimentoService  : ConhecimentoService,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private utilServices  : UtilServices,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      public  translate     : TranslateService,
      private modalService  : NgbModal,
      public  vRef          : ViewContainerRef
    ){

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({

        G052_IDG043 : [],
        G051_CDCTRC : [],
        G051_CDCARGA: [],
        G051_IDG046 : [],
        IDG024      : []
      });


      // ##### H015 -- CONFIGURAÇÃO
      this.objFormLiberar = formBuilder.group({
        IDG051    : [],
        IDG024    : [[], [Validators.required]],

      });

    }

    ngOnInit() {
      this.objFormLiberar;
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
    this.objFormLiberar.reset()
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



  viewCarga(id) {
    // this.objFormConfiguracao.reset();
    // this.exibir = 2
    // this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + this.breadcrumbs.home, "viewCarga", null, "fa fa-plus");
    // var obj = {"IDG058": id};
    // this.checkViewCarga = 1;
    this.idCargaView = id;
  }




  //##############################



  openDelete(id){
    this.idCarga = id;
    this.modal.open(this.modalDelete);
  }

  deleteCarga(ids){
    //console.log("===== >>>>> ", ids);
    if(ids.length == 0){
      this.toastr.warning("Selecione no mínimo uma carga");
    }else{
      this.grid.loadGridShow();
      // this.conhecimentoService.validaCancelar({IDG046: ids}).subscribe(
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





  //########## DATAGRID ##########
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }

  IdsG043   = {in:[]};
  IdsG051   = {in:[]};
  IdsCARGA  = {in:[]};
  IdsIDG046 = {in:[]};

  filtrar(){
    //console.log(this.arIds)
    this.IdsG043   = {in:[]};
    this.IdsG051   = {in:[]};
    this.IdsCARGA  = {in:[]};
    this.IdsIDG046 = {in:[]};

    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        this.IdsG043.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      this.objFormFilter.controls['G052_IDG043'].setValue(this.IdsG043);
    }else{
      this.objFormFilter.controls['G052_IDG043'].setValue(null);
    }

    if(this.arIdsIDG051.length > 0 ){
      for(let i of this.arIdsIDG051){
        this.IdsG051.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      this.objFormFilter.controls['G051_CDCTRC'].setValue(this.IdsG051);
    }else{
      this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
    }



    if(this.arIdsCDCARGA.length > 0 ){
      for(let i of this.arIdsCDCARGA){
        this.IdsCARGA.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      this.objFormFilter.controls['G051_CDCARGA'].setValue(this.IdsCARGA);
    }else{
      this.objFormFilter.controls['G051_CDCARGA'].setValue(null);
    }


    if(this.arIdsIDG046.length > 0 ){
      for(let i of this.arIdsIDG046){
        this.IdsIDG046.in.push(i.name)
      }
      //this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      this.objFormFilter.controls['G051_IDG046'].setValue(this.IdsIDG046);
    }else{
      this.objFormFilter.controls['G051_IDG046'].setValue(null);
    }
    // console.log(this.objFormFilter.value);
    this.grid.findDataTable('carga');
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
    // console.log("Busca Morotistas");
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


  filtrarIndi(event){
    // console.log(event)
    this.objFormFilter.value.STCARGA = event;
    if(this.objFormFilter.value.STCARGA == ""){
      this.objFormFilter.value.STCARGA = {"in":['R','O','X','A','S','T','C','E','F']};
    }
    this.grid.findDataTable('carga');
  }
  idsCtrc: any;
  openLiberar(obj){
    if(obj.length == 0){
      this.toastr.warning("Selecione no mínimo um Documento");
    }else{
      this.idsCtrc = '';
      this.modal.open(this.modalLibera);
      for (let i of obj) {
          this.idsCtrc += i + ',';
      }
    }
  }

  confirmaLiberar(){
    if(this.validaFormularioValido(this.objFormLiberar)){
      this.grid.loadGridShow();
      this.objFormLiberar.controls['IDG051'].setValue(this.idsCtrc);
      // console.log(this.objFormLiberar.value);
      this.conhecimentoService.liberarConhecimento(this.objFormLiberar.value).subscribe(
        data=>{
          this.toastr.success("Conhecimento Liberado com sucesso");
          this.find('carga');
          this.modal.closeModal();
          this.grid.loadGridHide();
        },
        err=>{
          this.grid.loadGridHide();
        }
      );
    }else{
      this.toastr.warning("Campos obrigatórios não preenchidos!");
    }
  }

}
