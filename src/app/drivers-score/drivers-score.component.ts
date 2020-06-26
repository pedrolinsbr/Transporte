import { DeParaService } from './../services/crud/de-para.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TipoApontamentoComponent } from './shared/tipo-apontamento/tipo-apontamento.component';

import { CampanhaComponent } from './shared/campanha/campanha.component';

import { LancamentoCampanhaComponent } from './shared/lancamento-campanha/lancamento-campanha.component';

import { UsuarioApontamentoComponent } from './shared/usuario-apontamento/usuario-apontamento.component';

import { PermissoesFechamentoComponent } from './shared/permissoes-fechamento/permissoes-fechamento.component';

@Component({
  selector: 'app-drivers-score',
  templateUrl: './drivers-score.component.html',
  styleUrls: ['./drivers-score.component.scss']
})
export class DriversScoreComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "dePara";
  urlDeParaGrid      = this.apiUrl+'it/dePara/listar'
  checkViewDePara    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idDePara            = null;
  currentJustify = 'fill';
  user           :any = null;

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private deParaService: DeParaService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private utilServices: UtilServices,
      private modal : ModalComponent,
      private grid : DatagridComponent,
      public  translate: TranslateService,
      private modalService: NgbModal,
      public  vRef: ViewContainerRef

    )
    {

      const browserLang: string = translate.getBrowserLang();
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDG005RE: [],
        IDG005DE: [],
        STCADAST: [],
        IDG024  : []
      });

      this.objFormConfiguracao = formBuilder.group({
        IDG058:     [],
        IDG005RE:   [],
        IDG005DE:   [],
        STCADAST:   [],
        IDS001:     [],
        IDG024:     [],

      });
    }


    ngOnInit() {
      this.objFormConfiguracao; //inicia biding com o form
      //console.log('aaa', localStorage.getItem('IDS001'));
      this.user = localStorage.getItem('IDS001');
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

  addDePara(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addDePara", null, "fa fa-plus");
    this.checkViewDePara = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewDePara(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewDePara", null, "fa fa-plus");
    var obj = {"IDG058": id};
    this.checkViewDePara = 1;
    this.getDePara(obj);
  }

  updateDePara(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateDePara", null, "fa fa-plus");
    var obj = {"IDG058": id};
    this.checkViewDePara = 2;
    this.getDePara(obj);
  }


  getDePara(obj){
    this.utilServices.loadGridShow();
    this.deParaService.getDePara(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG058'].setValue(data.IDG058);
        this.objFormConfiguracao.controls['STCADAST'].setValue(data.STCADAST);


        this.objFormConfiguracao.controls['IDG024'].setValue({
         id : data.IDG024,
         text: data.NMTRANSP
        });

        this.objFormConfiguracao.controls['IDG005RE'].setValue({
         id : data.IDG005RE,
         text: data.NMCLIENTRE
        });

        this.objFormConfiguracao.controls['IDG005DE'].setValue({
         id : data.IDG005DE,
         text: data.NMCLIENTDE
        });


        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes DePara", "getDePara", obj.IDG058, "fa fa-map");
  }


  saveDePara(){
   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveDePara = this.objFormConfiguracao.value;
      console.log("Informações sendo salvas ",objSaveDePara);
      //# update
      if (this.objFormConfiguracao.controls['IDG058'].value) {

        this.deParaService.updateDePara(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );
      } else {
        this.deParaService.addDePara(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );
      }
    } else {
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }

  }

  openDelete(id){
    this.idDePara = id;
    this.modal.open(this.modalDelete);
  }

  deleteDePara(ids){
    this.idDePara = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteDePara(){
    this.deParaService.deleteDePara(this.idDePara).subscribe(
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

  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){
    this.grid.findDataTable(this.idDataGrid);
  }


}
