import { TipoApontamentoService } from './../../../services/crud/tipo-apontamento.service';
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
  selector: 'app-tipo-apontamento',
  templateUrl: './tipo-apontamento.component.html',
  styleUrls: ['./tipo-apontamento.component.scss']
})
export class TipoApontamentoComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "tipoApontamento";
  urlTipoApontamentoGrid       = this.apiUrl+'tp/tipoApontamento/listar'
  checkViewTipoApontamento     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idTipoApontamento            = null;

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private tipoApontamentoService: TipoApontamentoService,
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
        IDG092: []

      });

      this.objFormConfiguracao = formBuilder.group({
        IDG092:     [],
        TPAPONTA:   ['', Validators.required],
        DSAPONTA:   ['', Validators.required],
        VRPONTUA:   [''],

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

  addTipoApontamento(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addTipoApontamento", null, "fa fa-plus");
    this.checkViewTipoApontamento = 4;
  }

  viewTipoApontamento(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewTipoApontamento", null, "fa fa-plus");
    var obj = {"IDG092": id};
    this.checkViewTipoApontamento = 1;
    this.getTipoApontamento(obj);
  }

  updateTipoApontamento(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateTipoApontamento", null, "fa fa-plus");
    var obj = {"IDG092": id};
    this.checkViewTipoApontamento = 2;
    this.getTipoApontamento(obj);
  }


  getTipoApontamento(obj){
    this.utilServices.loadGridShow();
    this.tipoApontamentoService.getTipoApontamento(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG092'].setValue(data.IDG092);
        this.objFormConfiguracao.controls['TPAPONTA'].setValue({id:data.TPAPONTA, text:this.utilServices.tipoPontuacao(data.TPAPONTA)});
        this.objFormConfiguracao.controls['DSAPONTA'].setValue(data.DSAPONTA);
        this.objFormConfiguracao.controls['VRPONTUA'].setValue(data.VRPONTUA);

        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes TipoApontamento", "getTipoApontamento", obj.IDG092, "fa fa-map");
  }


  saveTipoApontamento(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

    var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveTipoApontamento = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG092'].value) {

        this.tipoApontamentoService.updateTipoApontamento(slotsValue).subscribe(
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
        this.tipoApontamentoService.addTipoApontamento(slotsValue).subscribe(
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
    this.idTipoApontamento = id;
    this.modal.open(this.modalDelete);
  }

  deleteTipoApontamento(ids){
    this.idTipoApontamento = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteTipoApontamento(){
    this.utilServices.loadGridShow();
    this.tipoApontamentoService.deleteTipoApontamento(this.idTipoApontamento).subscribe(
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
