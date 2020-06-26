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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-log-aplicacao',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tela-log-aplicacao.component.html',
  styleUrls: ['./tela-log-aplicacao.component.scss']
})
export class TelaLogAplicacaoComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalLogAplicacao') private modalLogAplicacao;

  // ##### URL's
  apiUrl              = localStorage.getItem('URL_API');
  urlLogAplicacaoGrid = this.apiUrl+'tp/logsAplicacao/listar';
  url = this.global.getApiHost();
  dsDetalhe = null;
  detalhes = {tabelas:[], colunas:[]}
  detalhesUpdate =[]
  tipoAcao;
  showGrid:Boolean
  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];
  arIds    = [];

  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

  // ##### VALIDATORS
  collappsed          = null;
  exibir              = 1;

  // ##### FORMS
  objFormFilter       : FormGroup;
  objFormLogAplicacao       : FormGroup;

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
      public  vRef          : ViewContainerRef
    ){

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      // ##### FORM FILTER
      this.objFormFilter = formBuilder.group({
        IDG017      :['',Validators.required],
        IDS001      :[],
        IDUSUDB     :[],
        NMUSUARI    :[],
        DTREGIST    :[],
        TXMENSAG    :[],
        TXTRACE     :[],
        TXSQL       :[],
        DSPARAME    :[],
        DSMODULO    :[],
        DSURL       :[]
      });

    // ##### FORM LOG APLICACAO
      this.objFormLogAplicacao = formBuilder.group({
        IDG017      :['',Validators.required],
        IDS001      :[],
        IDUSUDB     :[],
        DTREGIST    :[],
        TXMENSAG    :[],
        TXRACE      :[],
        TXSQL       :[],
        DSPARAME    :[],
        DSMODULO    :[],
        DSURL       :[],
        NMUSUARI    :[]
      });

    }

    ngOnInit() {
      this.objFormLogAplicacao;
    }

    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
      }
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
    console.log("olokinho meu")
    if(this.objFormFilter.valid){
      this.exibir = 0;
      this.grid.findDataTable('logAplicacao','objFormFilter');
    }else{
      this.toastr.warning('Campos Obrigatórios não preenchidos');
    }
  }

  limpar(){
    this.objFormFilter.reset();
    this.grid.findDataTable('logAplicacao');

  }

  // viewChave(id) {
  //   console.log("o que vem:?", id);

  //   let auxConteu = null;
  //   this.dsDetalhe = id.DSDETALH;
  //   this.tipoAcao = id.DSACAO;
  //   // console.log("Ação => ", this.tipoAcao);
  //   this.modal.open(this.modalLogAplicacao, { size: 'lg'});

  //   this.dsConteu = id.DSDETALH;
  //   debugger;
  //   auxConteu = this.dsConteu.split("\n");

  //   this.dsConteu = auxConteu;






  //   return false;
  //   var aux;
  //   var aux2 = 0;
  //   var aux3 = 0;
  //   // console.log('this.dsDetalhe:',this.dsDetalhe);
  //   var dsDetalheGrid = this.dsDetalhe.replace(/(?:\r\n|\r|\n)/g, ' ')
  //   var dsdetalheSplit = dsDetalheGrid.split(";")
  //    console.log("dsDetalheGrid", dsDetalheGrid)
  //   switch(this.tipoAcao){
  //     case 2:{
  //       this.showGrid = true
  //       // console.log(dsdetalheSplit)
  //       this.detalhesUpdate = dsdetalheSplit
  //       // console.log("split dsdetalhe",dsdetalheSplit)
  //       // console.log(this.detalhesUpdate)
  //     break;
  //   }
  //     default:{
  //       this.showGrid = false
  //       for(let i = 0; i < dsDetalheGrid.length; i++){
  //         if(dsDetalheGrid[i] == ";"){
  //           this.detalhes.tabelas.push(dsDetalheGrid.slice(aux2,i));
  //           aux = i + 1;
  //           aux2 = i;
  //         }
  //         if(dsDetalheGrid[i] ==" "){
  //           this.detalhes.colunas.push(dsDetalheGrid.slice(aux,i));
  //           aux2 = i + 1 
  //         }
  //       }
  //       break;
  //     }
  //   }
  // }
}
