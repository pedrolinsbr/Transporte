// ##### IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

// ##### COMPONENTES
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

// ##### SERVICES
//import { ConhecimentoService } from './../services/geral/conhecimento.service';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../../services/globals.services';
import { LogService } from '../../services/crud/log.service';

@Component({
  selector: 'app-log',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tela-log.component.html',
  styleUrls: ['./tela-log.component.scss']
})
export class TelaLogComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalLog') private modalLog;

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  urlLogGrid        = this.apiUrl+'tp/logs/listar';
  url = this.global.getApiHost();
  dsDetalhe = null;
  detalhes = {tabelas:[], colunas:[]}
  detalhesUpdate =[]
  tipoAcao;
  showGrid:Boolean
  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  arIds    = [];
  arraytimeline       = [];
  arrObj            = [];

  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

  // ##### VALIDATORS
  collappsed          = null;
  exibir              = 1;
  controlView         = 2;
  mostrarGrid         = false;
  ativar              = false;
 

  // ##### FORMS
  objFormFilter       : FormGroup;

  // ##### MODAL
  modalRef: NgbModalRef;
  Ids: any;
  dsConteu:  any;

    constructor(
      private mensagens     : MensagensComponent,
      //private conhecimentoService  : ConhecimentoService,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private utilServices  : UtilServices,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      public  translate     : TranslateService,
      private modalService  : NgbModal,
      public  vRef          : ViewContainerRef,
      public  log           : LogService
    ){

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({
        IDS007      :['',Validators.required],
        DTREGIST    :[],
        DSCHAVE     :[],
        DSACAO      :[],
        DSDETALH    :[] 
      });

      // ##### H015 -- CONFIGURAÇÃO
    }

    ngOnInit() {

    }

    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
      }
    }

    changeOptionView(opc){
      //if(opc == 2){
        //if(this.ativar == true){
          this.controlView = opc;
         //}else{
        //   this.toastr.error('Busque para ter a visão por Timeline');
        // }
      //}else{
        //this.controlView = opc;
      //}
    }

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

  openDelete(id){
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  //########## DATAGRID ##########
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){
    
    this.objFormFilter.controls['DSCHAVE'].setValue((this.objFormFilter.controls['DSCHAVE'].value).trim());
    
    if(this.controlView == 1){

      if(this.objFormFilter.valid && ((this.objFormFilter.controls['DSCHAVE'].value && this.objFormFilter.controls['DSCHAVE'].value != null && this.objFormFilter.controls['DSCHAVE'].value != undefined && this.objFormFilter.controls['DSCHAVE'].value != 'undefined' && this.objFormFilter.controls['DSCHAVE'].value != '') || 
      (this.objFormFilter.controls['DSDETALH'].value && this.objFormFilter.controls['DSDETALH'].value != null && this.objFormFilter.controls['DSDETALH'].value != undefined && this.objFormFilter.controls['DSDETALH'].value != 'undefined' && this.objFormFilter.controls['DSDETALH'].value != ''))){
      // this.ativar = true;
      this.exibir = 0;
      this.mostrarGrid = true;
      this.grid.findDataTable('log');
      }else{
      this.utilServices.loadGridHide();
      this.toastr.warning('Campos Obrigatórios não preenchidos');
      }

    }else{
      if(this.controlView == 2){
        this.buscaTimeline();
      }
    }
    
  }

  limpar(){
    this.objFormFilter.reset();
    //this.grid.findDataTable('log');
  }

  viewChave(id) {
    console.log("o que vem:?", id);

    let auxConteu = null;
    this.dsDetalhe = id.DSDETALH;
    this.tipoAcao = id.DSACAO;
    // console.log("Ação => ", this.tipoAcao);
    this.modal.open(this.modalLog, { size: 'lg'});

    this.dsConteu = id.DSDETALH;
    
    auxConteu = this.dsConteu.split("\n");

    this.dsConteu = auxConteu;






    return false;
    var aux;
    var aux2 = 0;
    var aux3 = 0;
    // console.log('this.dsDetalhe:',this.dsDetalhe);
    var dsDetalheGrid = this.dsDetalhe.replace(/(?:\r\n|\r|\n)/g, ' ')
    var dsdetalheSplit = dsDetalheGrid.split(";")
     console.log("dsDetalheGrid", dsDetalheGrid)
    switch(this.tipoAcao){
      case 2:{
        this.showGrid = true
        // console.log(dsdetalheSplit)
        this.detalhesUpdate = dsdetalheSplit
        // console.log("split dsdetalhe",dsdetalheSplit)
        // console.log(this.detalhesUpdate)
      break;
    }
      default:{
        this.showGrid = false
        for(let i = 0; i < dsDetalheGrid.length; i++){
          if(dsDetalheGrid[i] == ";"){
            this.detalhes.tabelas.push(dsDetalheGrid.slice(aux2,i));
            aux = i + 1;
            aux2 = i;
          }
          if(dsDetalheGrid[i] ==" "){
            this.detalhes.colunas.push(dsDetalheGrid.slice(aux,i));
            aux2 = i + 1 
          }
        }
        break;
      }
    }
  }



  buscaTimeline(){
    // this.log.infoTimeline(this.objFormFilter.value).subscribe(
    //   data=>{
    //     this.arraytimeline = data.data;
    //   }
    // )
    if(this.objFormFilter.valid && ((this.objFormFilter.controls['DSCHAVE'].value != null && this.objFormFilter.controls['DSCHAVE'].value != undefined && this.objFormFilter.controls['DSCHAVE'].value != 'undefined' && this.objFormFilter.controls['DSCHAVE'].value != '') || 
                                    (this.objFormFilter.controls['DSDETALH'].value != null && this.objFormFilter.controls['DSDETALH'].value != undefined && this.objFormFilter.controls['DSDETALH'].value != 'undefined' && this.objFormFilter.controls['DSDETALH'].value != ''))){
      // var that    = this;
      // that.arrObj = [];
      // $('input[type="hidden"][name^="obj_checkbox_Timeline_"]').each(function (obj) {
      //   var objTop = JSON.parse(($(this).val()));
      //   objTop.DSDETALH = objTop.DSDETALH.split("\n");
      //   that.arrObj.push(objTop);
      // })
      this.utilServices.loadGridShow();
      this.arrObj = [];
      this.log.listarTimeLine(this.objFormFilter.value).subscribe(
        data => {
          for(let i=0; i < data.length; i++){
            data[i].DSDETALH = data[i].DSDETALH.split("\n");
            this.arrObj.push(data[i]);
          }

          this.utilServices.loadGridHide();
        }
      );
    }else{
      this.toastr.warning('Campos Obrigatórios não preenchidos');
    }
  }
}

