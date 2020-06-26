import { HistoricoService } from './../../services/crud/historico.service';
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
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.scss']
})
export class HistoricoComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "historico";
  urlHistoricoGrid      = this.apiUrl+'tp/historicoOcorrencia/listar'
  checkViewHistorico    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idHistorico            = null;



  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;

  //# modal
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private historicoService: HistoricoService,
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
        IDG012  : []

      });


      //# h015 --CONFIGURACAO
      this.objFormConfiguracao = formBuilder.group({

        IDG012:     [],
        DSHISTOR:   ['', Validators.required],
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



  //# Modal Delte Historico
  //##############################

  addHistorico(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addHistorico", null, "fa fa-plus");
    this.checkViewHistorico = 4;
    this.objFormConfiguracao.controls['STCADAST'].setValue('A');
  }

  viewHistorico(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewHistorico", null, "fa fa-plus");
    var obj = {"IDG012": id};
    this.checkViewHistorico = 1;
    this.getHistorico(obj);
  }

  updateHistorico(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateHistorico", null, "fa fa-plus");
    var obj = {"IDG012": id};
    this.checkViewHistorico = 2;
    this.getHistorico(obj);
  }


  getHistorico(obj){
    this.historicoService.getHistorico(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG012'].setValue(data.IDG012);
        this.objFormConfiguracao.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormConfiguracao.controls['DSHISTOR'].setValue(data.DSHISTOR);

        this.exibir = 2;
      }
    );
    // this.set(1,"Detalhes Historico", "getHistorico", obj.IDG012, "fa fa-map");
  }



  saveHistorico(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        

    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveHistorico = this.objFormConfiguracao.value;

      //# update
      if (this.objFormConfiguracao.controls['IDG012'].value) {

        this.historicoService.updateHistorico(slotsValue).subscribe(
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

        this.historicoService.addHistorico(slotsValue).subscribe(
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
    this.idHistorico = id;
    this.modal.open(this.modalDelete);
  }

  deleteHistorico(ids){
    this.idHistorico = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteHistorico(){

    this.historicoService.deleteHistorico(this.idHistorico).subscribe(
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
  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){
    //this.grid.findDataTable(this.idDataGrid);
    
  }
  //##############################


}
