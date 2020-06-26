import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HorarioCorteService } from '../../services/crud/horario-corte.service';

@Component({
  selector: 'app-horario-corte',
  templateUrl: './horario-corte.component.html',
  styleUrls: ['./horario-corte.component.scss']
})
export class HorarioCorteComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "horario-corte";
  urlHorarioCorteGrid      = this.apiUrl+'tp/horarioCorte/listar'
  checkViewHorarioCorte    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idHorarioCorte            = null;
  objfilter = {value:null};
  disabledColumns:boolean = false;
  objFormFilter:   FormGroup;
  objFormHorarioCorte:   FormGroup;

  //# modal
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private HorarioCorteService: HorarioCorteService,
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
        IDG014   :[],
        TPTRANSP :[],
        DTCORTE  :[],
        IDG105   :[]

      });


      //# h015 --CONFIGURACAO
      this.objFormHorarioCorte = formBuilder.group({
        IDG014    :[],
        TPTRANSP  :[],
        DTCORTE   :[],
        DTCORTEAUX:[],
        IDG105    :[]
      });
    }


    ngOnInit() {
      this.objFormHorarioCorte; //inicia biding com o form
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
    this.objFormHorarioCorte.reset()
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



  //# Modal Delte HorarioCorte
  //##############################

  addHorarioCorte(){
    this.objFormHorarioCorte.reset();
    this.exibir = 2
    this.disabledColumns = false;
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addHorarioCorte", null, "fa fa-plus");
    this.checkViewHorarioCorte = 4;
    
  }

  viewHorarioCorte(id) {
    this.objFormHorarioCorte.reset();
    this.exibir = 2
    this.disabledColumns = false;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewHorarioCorte", null, "fa fa-plus");
    var obj = {"IDG105": id};
    this.checkViewHorarioCorte = 1;
    this.getHorarioCorte(obj);
  }

  updateHorarioCorte(id) {
    this.objFormHorarioCorte.reset();
    this.exibir = 2
    this.disabledColumns = true;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateHorarioCorte", null, "fa fa-plus");
    var obj = {"IDG105": id};
    this.checkViewHorarioCorte = 2;
    this.getHorarioCorte(obj);
  }

  getHorarioCorte(obj){
    this.utilServices.loadGridShow();
    this.HorarioCorteService.getHorarioCorte(obj).subscribe(
      data=>{
        this.objFormHorarioCorte.controls['IDG105'].setValue(data.IDG105);
        
        let objOperacao = {id: data.IDG014, text: `${data.DSOPERAC}  [${data.IDG014}]`};
        this.objFormHorarioCorte.controls['IDG014'].setValue(objOperacao);

        let objDataCorte = new Date(data.DTCORTE)
        this.objFormHorarioCorte.controls['DTCORTE'].setValue({
          hour:objDataCorte.getHours(),
          minute:objDataCorte.getMinutes(),
          second:0
          });
        //console.log('aaaa',data.DTCORTE);

        this.alteraTipoTransporte(data.TPTRANSP);


        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
     this.set(1,"Detalhes HorarioCorte", "getHorarioCorte", obj.IDG105, "fa fa-map");
  }


  alteraTipoTransporte(id){
    if(id =='T'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Transferência'});
    }else if(id=='V'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Venda'});
    }else if(id=='D'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Devolução'});
    }else if(id=='C'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Complemento'});
    }else if(id=='O'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Outros'});
    }else if(id=='G'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Retorno de AG'});
    }else if(id=='R'){
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: 'Recusa'});
    }else{
      this.objFormHorarioCorte.controls['TPTRANSP'].setValue({id:id, text: '-'});
    }
  }

  saveHorarioCorte(){
   this.utilServices.loadGridShow();
   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormHorarioCorte.value);
        
      console.log(slotsValue)

    if (this.validaFormularioValido(this.objFormHorarioCorte)) {

      var objSaveHorarioCorte = this.objFormHorarioCorte.value;

      //# update
      if (this.objFormHorarioCorte.controls['IDG105'].value) {

        this.HorarioCorteService.updateHorarioCorte(slotsValue).subscribe(
          data => {
              this.objFormHorarioCorte.reset();
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

        this.HorarioCorteService.addHorarioCorte(slotsValue).subscribe(
          data => {
              this.objFormHorarioCorte.reset();
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
    this.idHorarioCorte = id;
    this.modal.open(this.modalDelete);
  }

  deleteHorarioCorte(ids){
    this.idHorarioCorte = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteHorarioCorte(){
    this.utilServices.loadGridShow();
    this.HorarioCorteService.deleteHorarioCorte(this.idHorarioCorte).subscribe(
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
