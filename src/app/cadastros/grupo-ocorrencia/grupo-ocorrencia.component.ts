import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


// ##### SERVICES
import { UtilServices            } from '../../shared/componentesbravo/src/app/services/util.services';
import { TranslateService        } from '@ngx-translate/core';
import { GrupoOcorrenciaService  } from './../../services/crud/grupo-ocorrencia.service';

// ##### COMPONENTES
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent     } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent  } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';


@Component({
  selector: 'app-grupo-ocorrencia',
  templateUrl: './grupo-ocorrencia.component.html',
  styleUrls: ['./grupo-ocorrencia.component.scss']
})
export class GrupoOcorrenciaComponent implements OnInit {
  apiService: any;

  // ###### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalDeleteUsuario') private modalDeleteUsuario;
  @ViewChild('acc')         private acc;

  // ###### URL's
  apiUrl                 = localStorage.getItem('URL_API');
  urlGrupoOcorrenciaGrid = this.apiUrl+'tp/grupoOcorrencia/listar';
  urlUsuarioGrupo        = this.apiUrl+'tp/usuarioGrupoOcorrencia/listar';
  enableCombo = null;
  // ###### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  // ###### ID's
  idGrupoOcorrencia   = null;
  idDataGrid          = "grupoOccorrencia";

  // ###### VIEW CONTROLS
  checkViewGrupoOcorrencia  = 0;
  collappsed                = null;
  exibir                    = 1;

  // ###### FORMS
  objFormFilter          :   FormGroup;
  objFormGrupoOcorrencia :   FormGroup;
  objFormUsuarioGrupo    :   FormGroup;

  // ###### MODAL
  modalRef: NgbModalRef;

    constructor(
      private mensagens              : MensagensComponent,
      private grupoOcorrenciaService : GrupoOcorrenciaService,
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
        IDG070   : [],
        IDG024   : [],
        IDG067   : []
      });

      // ##### G070 -- GRUPO OCORRENCIA
      this.objFormGrupoOcorrencia = formBuilder.group({
        IDG070   : [],
        DSGRUPO  : ['' , Validators.required],
        STCADAST : ['A', Validators.required],
        IDG024   : [[] , Validators.required],
      });

      // ##### G071 -- USUÁRIO GRUPO
      this.objFormUsuarioGrupo = formBuilder.group({
        IDG071   : [],
        IDG070   : [],
        IDS001OC : [[], Validators.required],
        IDG067   : [[], Validators.required],
        PCPARAM  : ['' , Validators.required],
        STCADAST : ['A', Validators.required],
        TPMODCAR: [[], Validators.required]
      });
    }


    ngOnInit() {
      this.objFormGrupoOcorrencia; //inicia biding com o form
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
    this.objFormGrupoOcorrencia.reset()
    this.objFormFilter.reset();
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

  addGrupoOcorrencia(){
    this.objFormGrupoOcorrencia.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addGrupoOcorrencia", null, "fa fa-plus");
    this.checkViewGrupoOcorrencia = 4;
    this.objFormGrupoOcorrencia.controls['STCADAST'].setValue('A');
  }

  viewGrupoOcorrencia(id) {
    this.objFormGrupoOcorrencia.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewGrupoOcorrencia", id, "fa fa-plus");
    var obj = {"IDG070": id};
    this.checkViewGrupoOcorrencia = 1;
    this.getGrupoOcorrencia(obj);
  }

  updateGrupoOcorrencia(id) {
    this.objFormGrupoOcorrencia.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateGrupoOcorrencia", null, "fa fa-plus");
    var obj = {"IDG070": id};
    this.checkViewGrupoOcorrencia = 2;
    this.getGrupoOcorrencia(obj);
  }


  getGrupoOcorrencia(obj){
    this.grid.loadGridShow();
    this.grupoOcorrenciaService.getGrupoOcorrencia(obj).subscribe(
      data=>{

        this.objFormGrupoOcorrencia.controls['IDG070'].setValue(data.IDG070);
        this.objFormGrupoOcorrencia.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormGrupoOcorrencia.controls['IDG024'].setValue({id:data.IDG024, text: data.G024_NMTRANSP});
        this.objFormGrupoOcorrencia.controls['DSGRUPO'].setValue(data.DSGRUPO);
        //this.objFormGrupoOcorrencia.controls['DSHISTOR'].setValue(data.DSHISTOR);

        this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
    // this.set(1,"Detalhes GrupoOcorrencia", "getGrupoOcorrencia", obj.IDG070, "fa fa-map");
  }



  saveGrupoOcorrencia(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormGrupoOcorrencia.value);
        

    if (this.validaFormularioValido(this.objFormGrupoOcorrencia)) {

      var objSaveGrupoOcorrencia = this.objFormGrupoOcorrencia.value;

      //# update
      if (this.objFormGrupoOcorrencia.controls['IDG070'].value) {

        this.grupoOcorrenciaService.updateGrupoOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormGrupoOcorrencia.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find('grupoOcorrencia');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );


      //# save
      } else {

        this.grupoOcorrenciaService.addGrupoOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormGrupoOcorrencia.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find('grupoOcorrencia');
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
    this.idGrupoOcorrencia = id;
    this.modal.open(this.modalDelete);
  }

  deleteGrupoOcorrencia(ids){
    this.idGrupoOcorrencia = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteGrupoOcorrencia(){

    this.grupoOcorrenciaService.deleteGrupoOcorrencia(this.idGrupoOcorrencia).subscribe(
      data => {
        this.find('grupoOcorrencia');
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
    this.find('grupoOcorrencia');
  }
  limpar(){
    this.objFormFilter.reset();
    this.find('grupoOcorrencia');

  }
  //##############################
  openAtribuirUsuario(id){
    this.exibir = 3;
    this.set(2, "Atribuir Usuário", "openAtribuirUsuario", id, "fas fa-user");
    this.idGrupoOcorrencia = id;
    this.objFormFilter.controls['IDG070'].setValue(this.idGrupoOcorrencia);


  }


  addUsuarioGrupoOcorrencia(){
    this.objFormUsuarioGrupo.reset();
    this.exibir = 4;
    this.set(3, this.utilServices.getStringTranslate('it.telas.acao.novo') + " Usuário", "addUsuarioGrupoOcorrencia", null, "fa fa-plus");
    this.checkViewGrupoOcorrencia = 4;
    this.objFormUsuarioGrupo.controls['STCADAST'].setValue('A');
    this.objFormUsuarioGrupo.controls['IDG070'].setValue(this.idGrupoOcorrencia);
    this.alteraTpModCar(1);
  }
  viewUsuarioGrupoOcorrencia(id){
    this.objFormUsuarioGrupo.reset();
    this.exibir = 4;
    this.set(3,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " Usuário", "viewUsuarioGrupoOcorrencia", id, "fa fa-plus");
    var obj = {"IDG071": id};
    this.checkViewGrupoOcorrencia = 1;
    this.getUsuarioGrupoOcorrencia(obj);
  }
  updateUsuarioGrupoOcorrencia(id){
    this.objFormUsuarioGrupo.reset();
    this.exibir = 4;
    this.set(3,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " Usuário", "updateUsuarioGrupoOcorrencia", id, "fa fa-plus");
    var obj = {"IDG071": id};
    this.checkViewGrupoOcorrencia = 2;
    this.getUsuarioGrupoOcorrencia(obj);
  }
  idUsuarioGrupoOcorrencia: any;
  openDeleteUsuario(id){
    this.idUsuarioGrupoOcorrencia = id;
    this.modal.open(this.modalDeleteUsuario);

  }
  confirmaDeleteUsuarioGrupoOcorrencia(){
    this.grid.loadGridShow();
    this.grupoOcorrenciaService.deleteUsuarioGrupoOcorrencia(this.idUsuarioGrupoOcorrencia).subscribe(
      data => {
        this.find('usuarioGrupo');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.grid.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.grid.loadGridHide();
       }
    );
  }
  getUsuarioGrupoOcorrencia(obj){
    this.grid.loadGridShow();
    this.grupoOcorrenciaService.getUsuarioGrupoOcorrencia(obj).subscribe(
      data=>{
        this.objFormUsuarioGrupo.controls['IDG071'].setValue(data.IDG071);
        this.objFormUsuarioGrupo.controls['IDG070'].setValue(data.IDG070);
        this.objFormUsuarioGrupo.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormUsuarioGrupo.controls['IDS001OC'].setValue({id:data.IDS001OC, text: data.S001OC_NMUSUARI});
        this.objFormUsuarioGrupo.controls['IDG067'].setValue({id:data.IDG067, text: data.G067_DSOCORRE});
        this.objFormUsuarioGrupo.controls['PCPARAM'].setValue(data.PCPARAM);
        this.alteraTpModCar(data.TPMODCAR);
        //this.objFormGrupoOcorrencia.controls['DSHISTOR'].setValue(data.DSHISTOR);
        this.exibir = 4;
        this.grid.loadGridHide();
      }
    );
    // this.set(1,"Detalhes GrupoOcorrencia", "getGrupoOcorrencia", obj.IDG070, "fa fa-map");
  }

  alteraTpModCar(id){
    if(id == 1){
      this.objFormUsuarioGrupo.controls['TPMODCAR'].setValue({id:id, text: '3PL'});
    }else if(id == 2){
      this.objFormUsuarioGrupo.controls['TPMODCAR'].setValue({id:id, text: '4PL'});
    }
  }

  saveUsuarioGrupoOcorrencia(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormUsuarioGrupo.value);
        

    if (this.validaFormularioValido(this.objFormUsuarioGrupo)) {

      var objSaveGrupoOcorrencia = this.objFormUsuarioGrupo.value;

      //# update
      if (this.objFormUsuarioGrupo.controls['IDG071'].value) {
        this.grid.loadGridShow();
        this.grupoOcorrenciaService.updateUsuarioGrupoOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormUsuarioGrupo.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('usuarioGrupo');
              this.grid.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
            this.grid.loadGridHide();

          }
        );


      //# save
      } else {
        this.grid.loadGridShow();
        this.grupoOcorrenciaService.addUsuarioGrupoOcorrencia(slotsValue).subscribe(
          data => {
              this.objFormUsuarioGrupo.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('usuarioGrupo');
              this.grid.loadGridHide();

          },
          err => {
            this.grid.loadGridHide();
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
}
