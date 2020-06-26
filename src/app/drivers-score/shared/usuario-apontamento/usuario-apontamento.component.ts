import { UsuarioApontamentoService } from './../../../services/crud/usuario-apontamento.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuario-apontamento',
  templateUrl: './usuario-apontamento.component.html',
  styleUrls: ['./usuario-apontamento.component.scss']
})
export class UsuarioApontamentoComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "usuarioApontamento";
  urlUsuarioApontamentoGrid       = this.apiUrl+'tp/usuarioApontamento/listar'
  checkViewUsuarioApontamento     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idUsuarioApontamento            = null;

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private usuarioApontamentoService: UsuarioApontamentoService,
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
        IDG101: [],
        IDG092: [],
        IDS001: [],
        IDG024: []
      });

      this.objFormConfiguracao = formBuilder.group({
        IDG101:   [''],
        IDG092:   ['', Validators.required],
        IDS001:   ['', Validators.required],
        IDG024:   [''],
        STRETIFI:   ['I']
      });
    }


    ngOnInit() {
      this.objFormConfiguracao; //inicia biding com o form
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

  addUsuarioApontamento(){
    this.objFormConfiguracao.controls['STRETIFI'].setValue("I");
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addUsuarioApontamento", null, "fa fa-plus");
    this.checkViewUsuarioApontamento = 4;
  }

  viewUsuarioApontamento(id) {
    this.objFormConfiguracao.controls['STRETIFI'].setValue("I");
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewUsuarioApontamento", null, "fa fa-plus");
    var obj = {"IDG101": id};
    this.checkViewUsuarioApontamento = 1;
    this.getUsuarioApontamento(obj);
  }

  updateUsuarioApontamento(id) {
    this.objFormConfiguracao.controls['STRETIFI'].setValue("I");
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateUsuarioApontamento", null, "fa fa-plus");
    var obj = {"IDG101": id};
    this.checkViewUsuarioApontamento = 2;
    this.getUsuarioApontamento(obj);
  }


  getUsuarioApontamento(obj){
    this.utilServices.loadGridShow();
    this.usuarioApontamentoService.getUsuarioApontamento(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG101'].setValue(data.IDG101);
        this.objFormConfiguracao.controls['IDG092'].setValue({id:data.IDG092, text:data.DSAPONTA});
        this.objFormConfiguracao.controls['IDS001'].setValue({id:data.IDS001, text:data.NMUSUARI});
        if(data.IDG024 != null){
          this.objFormConfiguracao.controls['IDG024'].setValue({id:data.IDG024, text:data.NMTRANSP});
        }
        if(data.STRETIFI != null){
          this.objFormConfiguracao.controls['STRETIFI'].setValue(data.STRETIFI);
        }else{
          this.objFormConfiguracao.controls['STRETIFI'].setValue("I");
        }

        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes UsuarioApontamento", "getUsuarioApontamento", obj.IDG092, "fa fa-map");
  }


  saveUsuarioApontamento(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

    var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveUsuarioApontamento = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG101'].value) {

        this.usuarioApontamentoService.updateUsuarioApontamento(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
            this.utilServices.loadGridHide();
          }
        );
      } else {
        this.usuarioApontamentoService.addUsuarioApontamento(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
            this.utilServices.loadGridHide();
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
    this.idUsuarioApontamento = id;
    this.modal.open(this.modalDelete);
  }

  deleteUsuarioApontamento(ids){
    this.idUsuarioApontamento = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteUsuarioApontamento(){
    this.utilServices.loadGridShow();
    this.usuarioApontamentoService.deleteUsuarioApontamento(this.idUsuarioApontamento).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
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
