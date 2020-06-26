import { LiberacaoService } from './../services/geral/liberacao.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-liberacao',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './liberacao.component.html',
  styleUrls: ['./liberacao.component.scss']
})
export class LiberacaoComponent implements OnInit {
  apiService: any;
  closeResult: string;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('acc') private acc;

  userId              = localStorage.getItem('ID_USER');
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "liberacao";
  urlLiberacaoGrid    = this.apiUrl+'tp/liberacaoOcorrencia/listar'
  checkViewLiberacao  = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idLiberacao         = null;



  objFormFilter:   FormGroup;
  objFormFilterH:   FormGroup;
  objFormConfiguracao:   FormGroup;

  //# modal
  modalRef: NgbModalRef;



  // @ViewChild('modalConfirmaReprovacao') modalConfirmaReprovacao: any;
  @ViewChild('modalConfirma') modalConfirma: any;
  @ViewChild('modalCarga') modalCarga: any;

  /*

  Tabela Liberacao G058
  G058.IDG058,
  G058.IDG005RE,
  G058.IDG005DE,
  G058.SNDELETE,
  G058.STCADAST,
  G058.DTCADAST,
  G058.IDS001,
  G058.IDG024

  */

    constructor(
      private mensagens : MensagensComponent,
      private liberacaoService: LiberacaoService,
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
        G024_IDG024  : [],
        STSITUAC: [],
        IDS001:   [],
        IDG067:   [],
      });

      this.objFormFilterH = formBuilder.group({
        G024_IDG024  : [],
        STSITUAC: [],
        IDS001:   [],
        IDG067:   [],
      });


      //# h015 --CONFIGURACAO
      this.objFormConfiguracao = formBuilder.group({
        TXVALIDA  : ['', [Validators.required]],
        IDG012    : ['', [Validators.required]],
        IDT004    : ['', [Validators.required]],
        IDG067    : ['', [Validators.required]],
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



  //##############################

  close(){
    this.modal.closeModal();
  }

  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){
    console.log(this.objFormFilter.controls['G024_IDG024'].value);
    console.log(this.objFormFilter.controls['STSITUAC'].value);
    console.log(this.objFormFilter.controls['IDS001'].value);
    console.log(this.objFormFilter.controls['IDG067'].value);
    if (this.objFormFilter.controls['G024_IDG024'].value != null && this.objFormFilter.controls['G024_IDG024'].value != undefined){
      this.objFormFilterH.controls['G024_IDG024'].setValue( {in: this.objFormFilter.controls['G024_IDG024'].value.id });
      console.log(this.objFormFilterH.controls['G024_IDG024'].value);
    }else{
      this.objFormFilterH.controls['G024_IDG024'].setValue(null);
    }
    if (this.objFormFilter.controls['STSITUAC'].value != null && this.objFormFilter.controls['STSITUAC'].value != undefined){
      this.objFormFilterH.controls['STSITUAC'].setValue(this.objFormFilter.controls['STSITUAC'].value.id);
      console.log(this.objFormFilterH.controls['STSITUAC'].value);
    }else{
      this.objFormFilterH.controls['STSITUAC'].setValue(null);
    }
    if (this.objFormFilter.controls['IDS001'].value != null && this.objFormFilter.controls['IDS001'].value != undefined){
      this.objFormFilterH.controls['IDS001'].setValue(this.objFormFilter.controls['IDS001'].value.id);
      console.log(this.objFormFilterH.controls['IDS001'].value);
    }else{
      this.objFormFilterH.controls['IDS001'].setValue(null);
    }
    // if (this.objFormFilter.controls['IDG067'].value != null && this.objFormFilter.controls['IDG067'].value != undefined){
    //   this.objFormFilter.controls['IDG067'].setValue(this.objFormFilter.controls['IDG067'].value.id);
    //   console.log(this.objFormFilter.controls['IDG067'].value);
    // }
    
    this.grid.findDataTable(this.idDataGrid+"", 'objFormFilterH');
  }
  //##############################

  action : any;
  functionName : any;
  openModalConfirmaAprovacao(objt){

    let obj = JSON.parse(objt);
    
    if(obj.IDS001 != this.userId && this.userId != '169'){
      this.toastr.warning('Sem permissão para aprovar');
    }else{
      
      this.objFormConfiguracao.reset();
      this.action = "Aprovação";
      this.objFormConfiguracao.controls['IDT004'].setValue(obj.IDT004);
      this.objFormConfiguracao.controls['IDG067'].setValue({id:obj.IDG067 , text:obj.DSOCORRE });
      this.objFormConfiguracao.controls['IDG012'].setValue({id:1 , text:"Padrão" });
      this.modal.open(this.modalConfirma);
    }

  }


  openModalConfirmaReprovacao(objt){
    let obj = JSON.parse(objt);
    
    if(obj.IDS001 != this.userId && this.userId != '169'){
      this.toastr.warning('Sem permissão para reprovar');
    }else{
      this.objFormConfiguracao.reset();
      this.action = "Reprovação";
      this.objFormConfiguracao.controls['IDT004'].setValue(obj.IDT004);
      this.objFormConfiguracao.controls['IDG067'].setValue({id:obj.IDG067 , text:obj.DSOCORRE });
      this.modal.open(this.modalConfirma);
    }
  }

  confirmar(action){
    this.grid.loadGridShow();
    if(action == "Aprovação" && this.validaFormularioValido(this.objFormConfiguracao)){
      //console.log("APROVAR :: ",this.objFormConfiguracao.value, action);
      this.liberacaoService.aprovarLiberacao(this.objFormConfiguracao.value).subscribe(
        data=>{
          this.toastr.success("Liberação Aprovada com Sucesso!");
          this.modal.closeModal();
          this.grid.loadGridHide();
          this.find('liberacao');
        },
        err=>{
          this.find('liberacao');
          this.grid.loadGridHide();
        }
      );
    } else if(action == "Reprovação" && this.validaFormularioValido(this.objFormConfiguracao)){
      //console.log("REPROVAR :: ",this.objFormConfiguracao.value, action);
      this.liberacaoService.reprovarLiberacao(this.objFormConfiguracao.value).subscribe(
        data=>{
          this.toastr.success("Liberação Reprovada com Sucesso!");
          this.modal.closeModal();
          this.grid.loadGridHide();
          this.find('liberacao');
        },
        err=>{
          this.find('liberacao');
          this.grid.loadGridHide();
        }
      );
    }
  }
  idCargaView: any;
  viewCarga(idCarga){
    //console.log("ID CARGA :: ",idCarga);
    this.idCargaView = idCarga.IDG046;
    this.modal.open(this.modalCarga, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }


}
