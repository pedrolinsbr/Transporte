import { ParametrosService } from '../../services/crud/parametros.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//services

import { ArmazemtranspService } from '../../services/crud/armazem-transp.service';

@Component({
  selector: 'app-armazem-transp',
  templateUrl: './armazem-transp.component.html',
  styleUrls: ['./armazem-transp.component.scss']
})
export class ArmazemTranspComponent implements OnInit {
  apiService: any;

  // ##### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  // ##### URL'S
  apiUrl              = localStorage.getItem('URL_API');
  urlArmazemTranspGrid= this.apiUrl+'tp/armazemTransp/listarArmazemTransp';

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  // ##### ID'S
  idArmazemTransp             = null;
  idDataGrid          = "armazem-transp";
  idTransp            :any;
  nmFunctionDelete    : any;


  // ##### VALIDATORS VIEW
  butsEdit            = false;
  butsNew             = true;
  viewGrid            = true;
  collappsed          = null;
  checkViewDePara     = 0;
  checkSaveCliente    = true;
  checkSaveCidade     = true;
  exibir              = 1;

  // ##### FORMS
  objFormFilter:   FormGroup;
  objFormArmazemTransp:   FormGroup;

  // ###### MODAL
  modalRef: NgbModalRef;



    constructor(
      private mensagens : MensagensComponent,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private utilServices: UtilServices,
      private modal : ModalComponent,
      private grid : DatagridComponent,
      public  translate: TranslateService,
      private modalService: NgbModal,
      public  vRef: ViewContainerRef,
      public ArmazemtranspService: ArmazemtranspService

    )
    {

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDG024  : [],
        IDG028  : []
      });


      //# T001 -- FORM ROTAS
      this.objFormArmazemTransp = formBuilder.group({
        IDG084  : [],
        IDG024  : ['', [Validators.required]],
        IDG028  : ['', [Validators.required]],

      });

    }


    ngOnInit() {
      this.objFormArmazemTransp; //inicia biding com o form
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
    this.objFormArmazemTransp.reset()
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

  addArmazemTransp(){
    this.butsEdit = false;
    this.objFormArmazemTransp.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addArmazemTransp", null, "fa fa-plus");
    this.checkViewDePara = 4;
  }
  viewArmazemTransp(id) {
    this.viewGrid = true;
    this.butsEdit = true;
    this.objFormArmazemTransp.reset();
    this.exibir = 2;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewArmazemTransp", id, "fa fa-plus");
    var obj = {"IDG084": id};
    this.checkViewDePara = 1;
    this.getArmazemTransp(obj);
  }

  updateArmazemTransps(id) {
    this.viewGrid = false;
    this.butsEdit = true;
    this.objFormArmazemTransp.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateArmazemTransps", id, "fa fa-plus");
    var obj = {"IDG084": id};
    this.checkViewDePara = 2;
    this.getArmazemTransp(obj);
  }

  getArmazemTransp(obj){
    this.idArmazemTransp = obj.IDG084;
    this.grid.loadGridShow();
    this.ArmazemtranspService.getArmazemTransp(obj).subscribe(
      data=>{
        this.objFormArmazemTransp.controls['IDG084'].setValue(data.IDG084);

        this.objFormArmazemTransp.controls['IDG024'].setValue({
         id : data.IDG024,
         text: data.NMTRANSP
        });
        this.objFormArmazemTransp.controls['IDG028'].setValue({
         id : data.IDG028,
         text: data.NMARMAZE
        });
        this.idTransp = data.IDG024;
        this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
  }

  saveArmazemTransp(){
    this.utilServices.loadGridShow();
   var result = null,
        copyObjFormArmazemTransp = null;
        copyObjFormArmazemTransp = Object.assign({}, this.objFormArmazemTransp.value);
    
    if (this.validaFormularioValido(this.objFormArmazemTransp)) {

      var objSaveDePara = this.objFormArmazemTransp.value;

      //# update
      if (this.objFormArmazemTransp.controls['IDG084'].value) {
        

        this.ArmazemtranspService.updateArmazemTransp(copyObjFormArmazemTransp).subscribe(
          data => {
              this.objFormArmazemTransp.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroArmaTransp();
            this.utilServices.loadGridHide();
          }
        );

      //# save
      } else {
        
        this.ArmazemtranspService.addArmazemTransp(copyObjFormArmazemTransp).subscribe(
          data => {
              
              this.objFormArmazemTransp.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroArmaTransp();
            this.utilServices.loadGridHide();
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

  openDeleteArmazemTransp(id){
    
    this.idArmazemTransp = id;
    this.nmFunctionDelete = 'deleteArmazemTransp';
    this.modal.open(this.modalDelete);
  }

  deleteArmazemTransp(){
    
    this.ArmazemtranspService.deleteArmazemTransp(this.idArmazemTransp).subscribe(
      data => {
        this.find(this.idDataGrid);
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





  //##############################
  //# DataGRID
  find(id){
    this.grid.findDataTable(id);
  }
  limpar(){
    this.objFormFilter.reset();
    this.grid.findDataTable('armazem-transp');
  }
  filtrar(){
    this.grid.findDataTable('armazem-transp');
  }
  //##############################


}
