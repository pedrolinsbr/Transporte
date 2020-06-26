import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


// ##### SERVICES
import { UtilServices            } from '../../shared/componentesbravo/src/app/services/util.services';
import { TranslateService        } from '@ngx-translate/core';
import { NivelOcorrenciaService  } from './../../services/crud/nivel-ocorrencia.service';

// ##### COMPONENTES
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent     } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent  } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';


@Component({
  selector: 'app-nivel-ocorrencia',
  templateUrl: './nivel-ocorrencia.component.html',
  styleUrls: ['./nivel-ocorrencia.component.scss']
})
export class NivelOcorrenciaComponent implements OnInit {
  apiService: any;

  // ###### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc')         private acc;

  // ###### URL's
  apiUrl                 = localStorage.getItem('URL_API');
  urlNivelOcorrenciaGrid = this.apiUrl+'tp/niveisOcorrencia/listar';
  enableCombo = null;
  // ###### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  // ###### ID's
  idNivelOcorrencia   = null;
  idDataGrid          = "nivelOccorrencia";

  // ###### VIEW CONTROLS
  checkViewNivelOcorrencia  = 0;
  collappsed                = null;
  exibir                    = 1;

  // ###### FORMS
  objFormFilter          :   FormGroup;
  objFormNivelOcorrencia :   FormGroup;

  // ###### MODAL
  modalRef: NgbModalRef;

    constructor(
      private mensagens              : MensagensComponent,
      private nivelOcorrenciaService : NivelOcorrenciaService,
      private formBuilder            : FormBuilder,
      private toastr                 : ToastrService,
      private utilServices           : UtilServices,
      private modal                  : ModalComponent,
      private grid                   : DatagridComponent,
      public  translate              : TranslateService,
      private modalService           : NgbModal,
      public  vRef                   : ViewContainerRef

    )
    {
      const browserLang: string = translate.getBrowserLang();
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDS001OC : [],
        IDG066   : [],
        IDG024   : [],
        IDG067   : [],
        IDG070   : []
      });

      // ##### G066 -- OCORRÊNCIA
      this.objFormNivelOcorrencia = formBuilder.group({
        IDG066   : [],
        IDS001OC : [],
        IDG067   : [[] , Validators.required],
        IDG024   : [[] , Validators.required],
        STCADAST : ['A', Validators.required],
        IDG070   : [[] , Validators.required],
      });
    }


    ngOnInit() {
      this.objFormNivelOcorrencia; //inicia biding com o form
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
    this.objFormNivelOcorrencia.reset()
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



  //# MODAL DELTE NIVELOCORRENCIA
  //##############################

  addNivelOcorrencia(){
    this.objFormNivelOcorrencia.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addNivelOcorrencia", null, "fa fa-plus");
    this.checkViewNivelOcorrencia = 4;
    this.objFormNivelOcorrencia.controls['STCADAST'].setValue('A');
  }

  viewNivelOcorrencia(id) {
    this.objFormNivelOcorrencia.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewNivelOcorrencia", null, "fa fa-plus");
    var obj = {"IDG066": id};
    this.checkViewNivelOcorrencia = 1;
    this.getNivelOcorrencia(obj);
  }

  updateNivelOcorrencia(id) {
    this.objFormNivelOcorrencia.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateNivelOcorrencia", null, "fa fa-plus");
    var obj = {"IDG066": id};
    this.checkViewNivelOcorrencia = 2;
    this.getNivelOcorrencia(obj);
  }


  getNivelOcorrencia(obj){
    this.grid.loadGridShow();
    this.nivelOcorrenciaService.getNivelOcorrencia(obj).subscribe(
      data=>{

        this.objFormNivelOcorrencia.controls['IDG066'].setValue(data.IDG066);
        this.objFormNivelOcorrencia.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormNivelOcorrencia.controls['IDS001OC'].setValue({id:data.IDS001OC, text: data.S001_NMUSUARI});
        this.objFormNivelOcorrencia.controls['IDG024'].setValue({id:data.IDG024, text: data.G024_NMTRANSP});
        this.objFormNivelOcorrencia.controls['IDG067'].setValue({id:data.IDG067, text: data.G067_DSOCORRE});
        this.objFormNivelOcorrencia.controls['IDG070'].setValue({id:data.IDG070, text: data.G070_DSGRUPO});

        //this.objFormNivelOcorrencia.controls['DSHISTOR'].setValue(data.DSHISTOR);

        this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
    // this.set(1,"Detalhes NivelOcorrencia", "getNivelOcorrencia", obj.IDG066, "fa fa-map");
  }



  saveNivelOcorrencia(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormNivelOcorrencia.value);
        

    if (this.validaFormularioValido(this.objFormNivelOcorrencia)) {

      var objSaveNivelOcorrencia = this.objFormNivelOcorrencia.value;

      //# update
      if (this.objFormNivelOcorrencia.controls['IDG066'].value) {

        this.nivelOcorrenciaService.updateNivelOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormNivelOcorrencia.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find('nivelOcorrencia');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );


      //# save
      } else {

        this.nivelOcorrenciaService.addNivelOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormNivelOcorrencia.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find('nivelOcorrencia');
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
    this.idNivelOcorrencia = id;
    this.modal.open(this.modalDelete);
  }

  deleteNivelOcorrencia(ids){
    this.idNivelOcorrencia = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteNivelOcorrencia(){

    this.nivelOcorrenciaService.deleteNivelOcorrencia(this.idNivelOcorrencia).subscribe(
      data => {
        this.find('nivelOcorrencia');
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
    this.find('nivelOcorrencia');
  }
  limpar(){
    this.objFormFilter.reset();
    this.find('nivelOcorrencia');

  }
  //##############################


}
