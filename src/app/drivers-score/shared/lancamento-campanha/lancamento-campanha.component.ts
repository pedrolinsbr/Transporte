import { LancamentoCampanhaService } from './../../../services/crud/lancamento-campanha.service';
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
  selector: 'app-lancamento-campanha',
  templateUrl: './lancamento-campanha.component.html',
  styleUrls: ['./lancamento-campanha.component.scss']
})
export class LancamentoCampanhaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "lancamentoCampanha";
  urlLancamentoCampanhaGrid       = this.apiUrl+'tp/lancamentoCampanha/listar'
  checkViewLancamentoCampanha     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idLancamentoCampanha            = null;
  disabledViewMultiSelect = true;

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private lancamentoCampanhaService: LancamentoCampanhaService,
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

          IDG093: [],
          IDG090: ['', Validators.required],
          IDG092: ['', Validators.required],
          IDG031: ['', Validators.required],
          IDG091: [[], Validators.required],
          IDG024: ['', Validators.required],
          VRPONTUA: ['', Validators.required],
          DTAPONTA: ['', Validators.required],
          DSOBSERV: ['', Validators.required],

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

  addLancamentoCampanha(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addLancamentoCampanha", null, "fa fa-plus");
    this.checkViewLancamentoCampanha = 4;
  }

  viewLancamentoCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewLancamentoCampanha", null, "fa fa-plus");
    var obj = {"IDG093": id};
    this.checkViewLancamentoCampanha = 1;
    this.getLancamentoCampanha(obj);
  }

  updateLancamentoCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateLancamentoCampanha", null, "fa fa-plus");
    var obj = {"IDG093": id};
    this.checkViewLancamentoCampanha = 2;
    this.getLancamentoCampanha(obj);
  }


  getLancamentoCampanha(obj){
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.getLancamentoCampanha(obj).subscribe(
      data=>{


        var dtPontua = null;
        dtPontua = new Date(data.DTAPONTA);
        dtPontua = {date:{year: dtPontua.getFullYear(), month: dtPontua.getMonth()+1 , day: dtPontua.getDate()}};


        this.objFormConfiguracao.controls['IDG093'].setValue(data.IDG093);

        this.objFormConfiguracao.controls['IDG090'].setValue({id:data.IDG090, text:data.DSCAMPAN});
        this.objFormConfiguracao.controls['IDG092'].setValue({id:data.IDG092, text:data.TPAPONTA});
        this.objFormConfiguracao.controls['IDG031'].setValue({id:data.IDG031, text:data.NMMOTORI});
        this.objFormConfiguracao.controls['IDG091'].setValue(data.IDG091);
        this.objFormConfiguracao.controls['IDG024'].setValue({id:data.IDG024, text:data.NMTRANSP});
        this.objFormConfiguracao.controls['VRPONTUA'].setValue(data.VRPONTUA);
        this.objFormConfiguracao.controls['DTAPONTA'].setValue(dtPontua);
        this.objFormConfiguracao.controls['DSOBSERV'].setValue(data.DSOBSERV);
        this.exibir = 2;
        this.utilServices.loadGridHide();
        console.log('aaa', this.objFormConfiguracao);
      }
    );
    this.set(1,"Detalhes LancamentoCampanha", "getLancamentoCampanha", obj.IDG093, "fa fa-map");
  }


  saveLancamentoCampanha(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveLancamentoCampanha = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG093'].value) {

        this.lancamentoCampanhaService.updateLancamentoCampanha(slotsValue).subscribe(
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
        this.lancamentoCampanhaService.addLancamentoCampanha(slotsValue).subscribe(
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
    this.idLancamentoCampanha = id;
    this.modal.open(this.modalDelete);
  }

  deleteLancamentoCampanha(ids){
    this.idLancamentoCampanha = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteLancamentoCampanha(){
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.deleteLancamentoCampanha(this.idLancamentoCampanha).subscribe(
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

  setTipoVeiculo(event) {
    //console.log('aaaa', event);
    //this.objFormCarga.controls['IDG030'].setValue({ id: event.idg030, text: event.dstipvei, qtcappes: event.qtcappes });
    this.objFormConfiguracao.controls['VRPONTUA'].setValue(event.vrpontua);
  }


  setTransportadorasParticipantes(event) {
    console.log('aaaa', event);
    //this.objFormCarga.controls['IDG030'].setValue({ id: event.idg030, text: event.dstipvei, qtcappes: event.qtcappes });
    //this.objFormConfiguracao.controls['VRPONTUA'].setValue(event.vrpontua);
    if(event != null && event.id != undefined && event.id != null){

      this.utilServices.loadGridShow();
      this.lancamentoCampanhaService.getTransportadorasParticipantes({IDG090:event.id}).subscribe(
        data => {
          this.objFormConfiguracao.controls['IDG091'].setValue(data);
          this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
          this.utilServices.loadGridHide();
         }
      );

    }else{
      this.objFormConfiguracao.controls['IDG091'].setValue(null);
    }


  }



}
