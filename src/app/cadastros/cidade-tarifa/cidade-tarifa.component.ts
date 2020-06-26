import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CidadeTarifaService } from '../../services/crud/cidade-tarifa.service';
@Component({
  selector: 'app-cidade-tarifa',
  templateUrl: './cidade-tarifa.component.html',
  styleUrls: ['./cidade-tarifa.component.scss']
})
export class CidadeTarifaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "cidade-tarifa";
  urlCidadeTarifaGrid      = this.apiUrl+'tp/cidadeTarifa/listar'
  checkViewCidadeTarifa    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idCidadeTarifa            = null;
  objfilter = {value:null};
  disabledColumns:boolean = false;
  objFormFilter:   FormGroup;
  objFormCidadeTarifa:   FormGroup;

  //# modal
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private CidadeTarifaService: CidadeTarifaService,
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
        IDG053   :[],
        IDG014   :[],
        IDG003OR :[],
        IDG003DE :[],
        QTDIAENT :[],
        QTDIENLO :[],
        QTDIACOL :[],
        CDTARIFA :[],
        TPDIAS   :[],
        IDG005   :[],
        TPTRANSP :[],
        STCADAST :[],
        NMCLIENT :[]

      });


      //# h015 --CONFIGURACAO
      this.objFormCidadeTarifa = formBuilder.group({
        IDG014   :[],
        IDG053   :[],
        IDG003OR :[],
        IDG003DE :[],
        QTDIAENT :[],
        QTDIENLO :[],
        QTDIACOL :[],
        CDTARIFA :[],
        TPDIAS   :[],
        IDG005   :[],
        STCADAST :[],
        TPTRANSP :[],
        G005_NMCLIENT :[]

      });
    }


    ngOnInit() {
      this.objFormCidadeTarifa; //inicia biding com o form
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
    this.objFormCidadeTarifa.reset()
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



  //# Modal Delte CidadeTarifa
  //##############################

  addCidadeTarifa(){
    this.objFormCidadeTarifa.reset();
    this.exibir = 2
    this.disabledColumns = false;
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addCidadeTarifa", null, "fa fa-plus");
    this.checkViewCidadeTarifa = 4;
    this.objFormCidadeTarifa.controls['STCADAST'].setValue('A');
  }

  viewCidadeTarifa(id) {
    this.objFormCidadeTarifa.reset();
    this.exibir = 2
    this.disabledColumns = false;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewCidadeTarifa", null, "fa fa-plus");
    var obj = {"IDG053": id};
    this.checkViewCidadeTarifa = 1;
    this.getCidadeTarifa(obj);
  }

  updateCidadeTarifa(id) {
    this.objFormCidadeTarifa.reset();
    this.exibir = 2
    this.disabledColumns = true;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateCidadeTarifa", null, "fa fa-plus");
    var obj = {"IDG053": id};
    this.checkViewCidadeTarifa = 2;
    this.getCidadeTarifa(obj);
  }

  getCidadeTarifa(obj){
    this.utilServices.loadGridShow();
    this.CidadeTarifaService.getCidadeTarifa(obj).subscribe(
      data=>{
        this.objFormCidadeTarifa.controls['IDG053'].setValue(data.IDG053);
        this.objFormCidadeTarifa.controls['STCADAST'].setValue(data.STCADAST);
        let objOperacao = {id: data.IDG014, text: `${data.DSOPERAC}  [${data.IDG014}]`};
        this.objFormCidadeTarifa.controls['IDG014'].setValue(objOperacao);
        this.objFormCidadeTarifa.controls['IDG003OR'].setValue({id:data.IDG003OR,text:data.NMCIDADEOR});
        this.objFormCidadeTarifa.controls['IDG003DE'].setValue({id:data.IDG003DE,text:data.NMCIDADEDE});
        this.objFormCidadeTarifa.controls['QTDIAENT'].setValue(data.QTDIAENT);
        this.objFormCidadeTarifa.controls['QTDIENLO'].setValue(data.QTDIENLO);
        this.objFormCidadeTarifa.controls['QTDIACOL'].setValue(data.QTDIACOL);
        this.objFormCidadeTarifa.controls['CDTARIFA'].setValue(data.CDTARIFA);
        this.objFormCidadeTarifa.controls['TPDIAS'].setValue(data.TPDIAS);

        if(data.IDG005){
          let obj = {id: data.IDG005, text: `${data.NMCLIENT}  [${data.IDG005}]`};
          this.objFormCidadeTarifa.controls['IDG005'].setValue(obj);
        }

        this.alteraTipoTransporte(data.TPTRANSP);


        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
     this.set(1,"Detalhes CidadeTarifa", "getCidadeTarifa", obj.IDG053, "fa fa-map");
  }


  alteraTipoTransporte(id){
    if(id =='T'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Transferência'});
    }else if(id=='V'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Venda'});
    }else if(id=='D'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Devolução'});
    }else if(id=='C'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Complemento'});
    }else if(id=='O'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Outros'});
    }else if(id=='G'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Retorno de AG'});
    }else if(id=='R'){
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: 'Recusa'});
    }else{
      this.objFormCidadeTarifa.controls['TPTRANSP'].setValue({id:id, text: '-'});
    }
  }

  saveCidadeTarifa(){
   this.utilServices.loadGridShow();
   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormCidadeTarifa.value);
        
      console.log(slotsValue)

    if (this.validaFormularioValido(this.objFormCidadeTarifa)) {

      var objSaveCidadeTarifa = this.objFormCidadeTarifa.value;

      //# update
      if (this.objFormCidadeTarifa.controls['IDG053'].value) {

        this.CidadeTarifaService.updateCidadeTarifa(slotsValue).subscribe(
          data => {
              this.objFormCidadeTarifa.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.utilServices.loadGridHide();
            this.toastr.error(err.error.response);
          }
        );


      //# save
      } else {

        this.CidadeTarifaService.addCidadeTarifa(slotsValue).subscribe(
          data => {
              this.objFormCidadeTarifa.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.toastr.error(err.error.response);
            this.utilServices.loadGridHide();
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
    this.idCidadeTarifa = id;
    this.modal.open(this.modalDelete);
  }

  deleteCidadeTarifa(ids){
    this.idCidadeTarifa = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteCidadeTarifa(){
    this.utilServices.loadGridShow();
    this.CidadeTarifaService.deleteCidadeTarifa(this.idCidadeTarifa).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.utilServices.loadGridHide();
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
    var arrayIdsIDG003DE = [];
    var arrayIdsIDG003OR = [];
    var arrayIdsTPTRANSP = [];
    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    //CIDADE ORIGEM
    if(Array.isArray(objfilterAux.IDG003OR)){

      if(objfilterAux.IDG003OR.length > 0){
          for(let objCidadeOrigem of objfilterAux.IDG003OR){
            arrayIdsIDG003OR.push(objCidadeOrigem.id);
          }
          objfilterAux.IDG003OR = {in: arrayIdsIDG003OR};
      }else{
          objfilterAux.IDG003OR = null;
      }
    }

    //CIDADE DESTINO
    if(Array.isArray(objfilterAux.IDG003DE)){

      if(objfilterAux.IDG003DE.length > 0){
          for(let objCidadeDestino of objfilterAux.IDG003DE){
            arrayIdsIDG003DE.push(objCidadeDestino.id);
          }
          objfilterAux.IDG003DE = {in: arrayIdsIDG003DE};
      }else{
          objfilterAux.IDG003DE = null;
      }
    }

    if(Array.isArray(objfilterAux.TPTRANSP)){

      if(objfilterAux.TPTRANSP.length > 0){
          for(let objTipoTransporte of objfilterAux.TPTRANSP){
            arrayIdsTPTRANSP.push(objTipoTransporte.id);
          }
          objfilterAux.TPTRANSP = {in: arrayIdsTPTRANSP};
      }else{
          objfilterAux.TPTRANSP = null;
      }
    }

    this.objfilter.value = objfilterAux
    this.grid.findDataTable(this.idDataGrid,'objfilter');
    
  }
  //##############################


}
