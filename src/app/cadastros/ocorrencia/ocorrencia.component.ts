import { OcorrenciaService } from './../../services/crud/ocorrencia.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ocorrencia',
  templateUrl: './ocorrencia.component.html',
  styleUrls: ['./ocorrencia.component.scss']
})
export class OcorrenciaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = 'ocorrencias';
  urlOcorrenciaGrid      = this.apiUrl+'tp/ocorrencia/listar'
  checkViewOcorrencia    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idOcorrencia            = null;



  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;

  //# modal
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private ocorrenciaService: OcorrenciaService,
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
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({

        STCADAST: [],
        IDG067  : []

      });


      //# h015 --CONFIGURACAO
      this.objFormConfiguracao = formBuilder.group({

        IDG067:     [],
        DSOCORRE:   ['', Validators.required],
        STCADAST:   ['A', Validators.required],

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



  //# Modal Delte Ocorrencia
  //##############################

  addOcorrencia(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addOcorrencia", null, "fa fa-plus");
    this.checkViewOcorrencia = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewOcorrencia(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewOcorrencia", null, "fa fa-plus");
    var obj = {"IDG067": id};
    this.checkViewOcorrencia = 1;
    this.getOcorrencia(obj);
  }

  updateOcorrencia(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateOcorrencia", null, "fa fa-plus");
    var obj = {"IDG067": id};
    this.checkViewOcorrencia = 2;
    this.getOcorrencia(obj);
  }


  getOcorrencia(obj){
    this.ocorrenciaService.getOcorrencia(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG067'].setValue(data.IDG067);
        this.objFormConfiguracao.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormConfiguracao.controls['DSOCORRE'].setValue(data.DSOCORRE);

        this.exibir = 2;
      }
    );
    // this.set(1,"Detalhes Ocorrencia", "getOcorrencia", obj.IDG067, "fa fa-map");
  }



  saveOcorrencia(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        

    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveOcorrencia = this.objFormConfiguracao.value;

      //# update
      if (this.objFormConfiguracao.controls['IDG067'].value) {

        this.ocorrenciaService.updateOcorrencia(slotsValue).subscribe(
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


      //# save
      } else {

        this.ocorrenciaService.addOcorrencia(slotsValue).subscribe(
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


    //# Formulario incompleto
    } else {
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }

  }

  //##############################



  openDelete(id){
    this.idOcorrencia = id;
    this.modal.open(this.modalDelete);
  }

  deleteOcorrencia(ids){
    this.idOcorrencia = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteOcorrencia(){
    this.ocorrenciaService.deleteOcorrencia(this.idOcorrencia).subscribe(
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
  //##############################




  //# DataGRID
  //##############################
  find(id) {
    this.grid.findDataTable(id);
  }

  filtrar() {
    this.grid.findDataTable(this.idDataGrid);
  }

  limpar() {
    this.objFormFilter.reset();
    this.filtrar();
  }
  //##############################


}
