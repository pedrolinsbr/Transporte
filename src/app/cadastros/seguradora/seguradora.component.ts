import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


//services
import { SeguradoraService } from './../../services/crud/seguradora.service';


@Component({
  selector: 'app-seguradora',
  templateUrl: './seguradora.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./seguradora.component.scss']
})
export class SeguradoraComponent implements OnInit {
  apiService: any;

  // ##### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalSeguradora') modalSeguradora;

  // ##### URL'S
  apiUrl              = localStorage.getItem('URL_API');
  urlRotaGridSegura   = this.apiUrl+'tp/seguradora/listar';
  urlRotaGridCidade   = this.apiUrl+'tp/rota/listarCidade';
  urlRotaGridApolices =  this.apiUrl+'tp/apolice/listar';

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  // ##### ID'S
  idSeguradora         = null;
  idDataGrid          = "rotas";
  idCliente           : any;
  idApolice            : any;
  idTransp            : any;
  nmFunctionDelete    : any;


  // ##### VALIDATORS VIEW
  butsEdit            = false;
  butsNew             = true;
  viewGrid            = true;
  collappsed          = null;
  checkViewDePara     = 0;
  checkSaveCliente    = true;
  checkSaveApolice    = true;
  exibir              = 1;
  /*
    STATUS EXIBIR
    1 - GRID SEGURADORAS // HOME
    2 - SEGURADORA - EDITAR // VISUALIZAR // INSERIR
    3 - GRID APOLICES
    4 - APOLICE - EDITAR // VISUALIZAR // INSERIR
  */

  // ##### FORMS
  objFormFilter:   FormGroup;
  objFormSegura:   FormGroup;
  objFormApolice:  FormGroup;

  // ###### MODAL
  modalRef: NgbModalRef;



    constructor(
      private mensagens    : MensagensComponent,
      private formBuilder  : FormBuilder,
      private toastr       : ToastrService,
      private utilServices : UtilServices,
      private segService   : SeguradoraService,
      private modal        : ModalComponent,
      private grid         : DatagridComponent,
      public  translate    : TranslateService,
      private modalService : NgbModal,
      public  vRef         : ViewContainerRef,

    )
    {

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDG024  : [],
        IDG014  : [],
        IDG041  : []
      });

      //# G041 -- FORM SEGURADORA
      this.objFormSegura = formBuilder.group({
        IDG041   : [],
        RSSEGURA : ['', [Validators.required]],
        CJSEGURA : ['', [Validators.required]],
        IESEGURA : ['', [Validators.required]],
        STCADAST: ['', [Validators.required]],
      });

      //# G047 -- FORM APOLICE
      this.objFormApolice = formBuilder.group({
        IDG041   : ['', [Validators.required]],
        IDG047   : [],
        IDG014   : ['', [Validators.required]],
        NRAPOSEG : ['', [Validators.required]],
        VRMAXCAR : ['', [Validators.required]],
        VRMAXESC : ['', [Validators.required]],
        SNSEGPRO : ['', [Validators.required]],
        DTVENAPO : ['', [Validators.required]],
        STCADAST : ['', [Validators.required]],
      });
    }


    ngOnInit() {
      this.objFormSegura.controls['STCADAST'].setValue('A');
      this.objFormSegura; //inicia biding com o form
    }

    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
      }
    }


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
    this.objFormSegura.reset()
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
  // FUNÇÕES ROTAS

  addSeguradora(){
    this.butsEdit = false;
    this.objFormSegura.reset();
    this.objFormSegura.controls['STCADAST'].setValue('A');
    this.exibirModal = 2
    //this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addSeguradora", null, "fa fa-plus");
    this.checkViewDePara = 4;
  }
  viewSeguradora(id) {
    this.viewGrid = true;
    this.butsEdit = true;
    this.objFormSegura.reset();
    this.exibirModal = 2
    // this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewSeguradora", id, "fa fa-plus");
    var obj = {"IDG041": id};
    this.checkViewDePara = 1;
    this.getSeguradora(obj);
  }

  updateSeguradoras(id) {
    this.viewGrid = false;
    this.butsEdit = true;
    this.objFormSegura.reset();
    this.exibirModal = 2
  //  this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateSeguradoras", id, "fa fa-plus");
    var obj = {"IDG041": id};
    this.checkViewDePara = 2;
    this.getSeguradora(obj);
  }

  getSeguradora(obj){
    this.idSeguradora = obj.IDG041;
    this.grid.loadGridShow();
    this.segService.getSeguradora(obj).subscribe(
      data=>{
        //console.log("DATAO :: " ,data)
        this.objFormSegura.controls['IDG041'].setValue(data.IDG041);
        this.objFormSegura.controls['STCADAST'].setValue(data.STCADAST)
        this.objFormSegura.controls['RSSEGURA'].setValue(data.RSSEGURA);
        this.objFormSegura.controls['CJSEGURA'].setValue(data.CJSEGURA);
        this.objFormSegura.controls['IESEGURA'].setValue(data.IESEGURA);

        //this.idTransp = data.IDG024;
        //this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
  }

  saveSeguradora(){
   var result = null,
        copyobjFormSegura = null;
        copyobjFormSegura = Object.assign({}, this.objFormSegura.value);
    //console.log(copyobjFormSegura);

    if (this.validaFormularioValido(this.objFormSegura)) {
      var objSaveDePara = this.objFormSegura.value;

      //# update
      if (this.objFormSegura.controls['IDG041'].value) {
        //console.log("UPDATE :: ", copyobjFormSegura);

        this.grid.loadGridShow();
        this.segService.updateSeguradora(copyobjFormSegura).subscribe(
          data => {
              this.objFormSegura.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.voltarModal();
              this.grid.loadGridHide();
              this.find('seguradoras');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      //# save
      } else {
        //console.log("SAVE :: ", copyobjFormSegura);
        copyobjFormSegura.CJSEGURA = copyobjFormSegura.CJSEGURA.split('.').join('');
        copyobjFormSegura.CJSEGURA = copyobjFormSegura.CJSEGURA.split('/').join('');
        copyobjFormSegura.CJSEGURA = copyobjFormSegura.CJSEGURA.split('-').join('');
        this.grid.loadGridShow();
        this.segService.addSeguradora(copyobjFormSegura).subscribe(
          data => {
              //console.log(data)
              this.objFormSegura.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.voltarModal();
              this.grid.loadGridHide();
              this.find('seguradoras');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      }

    //# Formulario incompleto
    } else {
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }

  }

  openDeleteSeguradora(id){
    //console.log("Cheguei");
    this.idSeguradora = id;
    this.nmFunctionDelete = 'deleteSeguradora';
    this.modal.open(this.modalDelete);
  }

  deleteSeguradora(){
    //console.log("Cheguei");
    this.segService.deleteSeguradora(this.idSeguradora).subscribe(
      data => {
        this.find('seguradoras');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
       }
    );
  }


  //###############################
  // FUNÇÕES CIDADES
  openApolices(){
    this.exibir = 3;
    this.set(3, " Apólices " + this.breadcrumbs.home +" "+ this.idSeguradora, "openApolices", null, "fas fa-file-alt");
  }

  addApolice(){
    this.checkSaveApolice = true;
    this.objFormApolice.reset();
    this.objFormApolice.controls['STCADAST'].setValue('A');
    //this.objFormApolice.controls['IDG041'].setValue(this.idSeguradora);
    this.set(4, "Nova Apólice", "addApolice", null, "fa fa-plus");
    this.exibir = 4;
  }

  viewApolice(idApolice){
    this.checkSaveApolice = false;
    this.exibir = 4;
    //this.objFormApolice.controls['IDG041'].setValue(this.idSeguradora);
    this.set(4, "Visualizar Apólice", "viewCidade", idApolice, "fa fa-eye");
    this.getApolice(idApolice);

  }

  updateApolice(idApolice){
    this.checkSaveApolice = true;
    this.exibir = 4;
    //this.objFormApolice.controls['IDG041'].setValue(this.idSeguradora);
    this.set(4, "Editar Apólice", "updateCidade", idApolice, "fa fa-edit");
    this.getApolice(idApolice);

  }
  getApolice(id){
    let obj = {'IDG047': id}
    this.grid.loadGridShow();
    this.segService.getApolice(obj).subscribe(
      data=>{
        //console.log("DATAO :: " ,data);
        // this.objFormApolice.reset();

        this.objFormApolice.controls['IDG041'].setValue({id: data.IDG041, text: data.G041_RSSEGURA});

        this.objFormApolice.controls['IDG047'].setValue(data.IDG047);
        if(data.IDG014){
          this.objFormApolice.controls['IDG014'].setValue({id:data.IDG014, text: data.DSOPERAC});
        }
        if(data.DTVENAPO){
          this.objFormApolice.controls['DTVENAPO'].setValue(this.utilServices.getDateObjFromString(data.DTVENAPO));
        }
        this.objFormApolice.controls['NRAPOSEG'].setValue(data.NRAPOSEG);
        this.objFormApolice.controls['VRMAXCAR'].setValue(data.VRMAXCAR);
        this.objFormApolice.controls['VRMAXESC'].setValue(data.VRMAXESC);
        this.objFormApolice.controls['SNSEGPRO'].setValue((data.SNSEGPRO == 'S') ? {id: 1,text:"Sim"} : {id: 0,text:"Não"});
        this.objFormApolice.controls['STCADAST'].setValue(data.STCADAST);
        this.grid.loadGridHide();
      }
    );
  }

  saveApolice(){
   var result = null,
        copyobjFormSegura = null;
        copyobjFormSegura = Object.assign({}, this.objFormApolice.value);
    //console.log(copyobjFormSegura);

    if (this.validaFormularioValido(this.objFormApolice)) {

      var objSaveDePara = this.objFormApolice.value;

      //# update
      if (this.objFormApolice.controls['IDG047'].value) {
        //console.log("UPDATE :: ", copyobjFormSegura);
        copyobjFormSegura.SNSEGPRO = (copyobjFormSegura.SNSEGPRO.id == 1)? 'S' : 'N';
        copyobjFormSegura.DTVENAPO = this.utilServices.getStringFromDateObj(copyobjFormSegura.DTVENAPO);
        this.segService.updateApolice(copyobjFormSegura).subscribe(
          data => {
              this.objFormApolice.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('apolices');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      //# save
      } else {
        copyobjFormSegura.SNSEGPRO = (copyobjFormSegura.SNSEGPRO.id == 1)? 'S' : 'N';
        copyobjFormSegura.DTVENAPO = this.utilServices.getStringFromDateObj(copyobjFormSegura.DTVENAPO);
        // //console.log("SAVE :: ", copyobjFormSegura);
        this.segService.addApolice(copyobjFormSegura).subscribe(
          data => {
              this.objFormApolice.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('apolices');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      }

    //# Formulario incompleto
    } else {
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }

  }
  openDeleteApolice(id){
    this.idApolice = id;
    this.nmFunctionDelete = 'deleteApolice';
    this.modal.open(this.modalDelete);
  }

  deleteApolice(){
    this.segService.deleteApolice(this.idApolice).subscribe(
      data => {
        this.find('apolices');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
       }
    );
  }

  //###############################


  close(){
    this.modal.closeModal();
  }



  //##############################

  exibirModal: any;
  openModalSeguradora(){
    this.modal.open(this.modalSeguradora, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
    this.exibirModal = 1;
  }
  voltarModal(){
    this.exibirModal = 1;
  }

  //##############################
  //# DataGRID
  find(id){
    this.grid.findDataTable(id);
  }
  limpar(){
    this.objFormFilter.reset();
    this.grid.findDataTable('apolices');
  }
  filtrar(){
    this.grid.findDataTable('apolices');
  }
  //##############################


}
