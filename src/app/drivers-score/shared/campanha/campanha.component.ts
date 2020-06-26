import { CampanhaService } from './../../../services/crud/campanha.service';
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
  selector: 'app-campanha',
  templateUrl: './campanha.component.html',
  styleUrls: ['./campanha.component.scss']
})
export class CampanhaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "campanha";
  urlCampanhaGrid       = this.apiUrl+'tp/campanha/listar'
  checkViewCampanha     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idCampanha            = null;

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private campanhaService: CampanhaService,
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
        IDG090: []

      });

      this.objFormConfiguracao = formBuilder.group({
        IDG090:     [],
        DSCAMPAN:   ['', Validators.required],
        DTINICIO:   ['', Validators.required],
        DTFIM:      ['', Validators.required],
        PTINICIO:   ['', Validators.required],
        PTMENSAL:   ['', Validators.required],
        DSPREMIA:   ['', Validators.required],
        IDG024  :   [[], Validators.required] 

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

  addCampanha(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addCampanha", null, "fa fa-plus");
    this.checkViewCampanha = 4;
  }

  viewCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewCampanha", null, "fa fa-plus");
    var obj = {"IDG090": id};
    this.checkViewCampanha = 1;
    this.getCampanha(obj);
  }

  updateCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateCampanha", null, "fa fa-plus");
    var obj = {"IDG090": id};
    this.checkViewCampanha = 2;
    this.getCampanha(obj);
  }


  getCampanha(obj){
    this.utilServices.loadGridShow();
    this.campanhaService.getCampanha(obj).subscribe(
      data=>{
        var dtInicio = null;
        dtInicio = new Date(data.DTINICIO);
        dtInicio = {date:{year: dtInicio.getFullYear(), month: dtInicio.getMonth()+1 , day: dtInicio.getDate()}};

        var dtFim = null;
        dtFim = new Date(data.DTFIM);
        dtFim = {date:{year: dtFim.getFullYear(), month: dtFim.getMonth()+1 , day: dtFim.getDate()}};

        this.objFormConfiguracao.controls['IDG090'].setValue(data.IDG090);
        this.objFormConfiguracao.controls['DSCAMPAN'].setValue(data.DSCAMPAN);
        this.objFormConfiguracao.controls['DTINICIO'].setValue(dtInicio);
        this.objFormConfiguracao.controls['DTFIM'].setValue(dtFim);
        this.objFormConfiguracao.controls['PTINICIO'].setValue(data.PTINICIO);
        this.objFormConfiguracao.controls['PTMENSAL'].setValue(data.PTMENSAL);
        this.objFormConfiguracao.controls['DSPREMIA'].setValue(data.DSPREMIA);
        this.objFormConfiguracao.controls['IDG024'].setValue(data.IDG091);

        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes Campanha", "getCampanha", obj.IDG090, "fa fa-map");
  }


  saveCampanha(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

    var dtInicioAux = null;
    dtInicioAux = this.objFormConfiguracao.controls['DTINICIO'].value.date;
    dtInicioAux = new Date(parseInt(dtInicioAux.year), parseInt(dtInicioAux.month) - 1, parseInt(dtInicioAux.day));

    var dtFimAux = null;
    dtFimAux = this.objFormConfiguracao.controls['DTFIM'].value.date;
    dtFimAux = new Date(parseInt(dtFimAux.year), parseInt(dtFimAux.month) - 1, parseInt(dtFimAux.day));

    if(dtFimAux < dtInicioAux){
      this.toastr.warning( "Data da fim não pode ser inferior a data de início","Atenção");
      this.grid.loadGridHide();
      return false;
    }


   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveCampanha = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG090'].value) {

        this.campanhaService.updateCampanha(slotsValue).subscribe(
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
        this.campanhaService.addCampanha(slotsValue).subscribe(
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
    this.idCampanha = id;
    this.modal.open(this.modalDelete);
  }

  deleteCampanha(ids){
    this.idCampanha = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteCampanha(){
    this.utilServices.loadGridShow();
    this.campanhaService.deleteCampanha(this.idCampanha).subscribe(
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
