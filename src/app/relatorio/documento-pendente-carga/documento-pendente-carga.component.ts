import { DocumentoPendenteCargaService } from '../../services/crud/documento-pendente-carga.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-documento-pendente-carga',
  templateUrl: './documento-pendente-carga.component.html',
  styleUrls: ['./documento-pendente-carga.component.scss']
})
export class DocumentoPendenteCargaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalCarga') modalCarga: any;
  @ViewChild('acc') private acc;
  @ViewChild('modalConhecimento') private modalConhecimento;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "DocumentoPendenteCarga";
  urlDocumentoPendenteCargaGrid = this.apiUrl+'tp/documentoPendenteCarga/listar'
  arBreadcrumbsLocal  = [];
  
  exibir              = 1;
  collappsed          = null;
  objfilter = {value:null};

  //ArIds
  arIdIDG046    = [];
  arIdIDG051    = [];
  arIdCDCTRC    = [];
  arIdIDCARLOG  = [];
  arIdsIDG043   = [];
  arIdsCDDELIVE = [];
 
  objFormFilter:         FormGroup;
  objFormFilterH:        FormGroup;
  objFormConfiguracao:   FormGroup;

  data = new Date();
  idCargaView = 0;
  conhecimentoAtual = "";
  idConhecimentoView = 0;

  //# modal
  modalRef: NgbModalRef;


    constructor(
      private mensagens : MensagensComponent,
      private DocumentoPendenteCargaService: DocumentoPendenteCargaService,
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

        G046_IDG046:    [],
        G051_IDG051:    [],
        G051_CDCTRC:    [],
        G046_IDCARLOG:  [],
        G046_DTCARGA:   [],
        G046_STENVLOG:  [],
        G046_IDG024:    [],
        G046_STCARGA:   [],
        G043_IDG043:    [],
        G043_CDDELIVE:  [],

      });



      //# h015 --CONFIGURACAO
      this.objFormConfiguracao = formBuilder.group({

        IDG024:     []
      });
    }

    objStyle             = {
      'background' : '#43295b',
      'color'      : '#ffffff',
      'iconColor'  : '#ffffff',
      'iconOpacity': '0.5'
    };


    ngOnInit() {
      this.objFormConfiguracao; //inicia biding com o form

      moment.locale('pt-BR');
      //debugger;
      let data = moment();
      let aux1 = data.format('L');
      let aux2 = data.subtract(15, 'days').format('L');
  
      let auxB = aux2.split("/");
      let auxA = aux1.split("/");
      
      this.objFormFilter.controls['G046_DTCARGA'].setValue( 
        { endDate : {year: auxA[2], month: parseInt(auxA[1]), day: parseInt(auxA[0])}, 
          beginDate   : {year: auxB[2], month: parseInt(auxB[1]), day: parseInt(auxB[0])},
        formatted : aux2+" - "+aux1 } );
    }

    validaFormularioValido(objForm) {
      if (objForm.valid) {
        return true;
      } else {
        return false;
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

  viewCarga(id) {
    this.idCargaView = id.IDG046;
    // this.modal.open(this.modalCarga, { size: 'lg' });

    this.modal.open(this.modalCarga, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }

  viewConhecimento(obj) {
    this.conhecimentoAtual = "";
    console.log(obj);
    this.idConhecimentoView = obj.IDG051;
    this.conhecimentoAtual = obj.CDCTRC;
    this.modal.open(this.modalConhecimento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
  }





  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
  Ids = {in:[]} 
  filtrar(){
    this.Ids = {in:[]};

    let arrayIdStatus  = [];

    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    //Id carga Evolog
    if(this.arIdIDG046.length > 0 ){
      for(let i of this.arIdIDG046){
        this.Ids.in.push(i.name)
      }
      objfilterAux.G046_IDG046 = this.Ids;
    }else{
      this.objFormFilter.controls['G046_IDG046'].setValue(null);
      objfilterAux.G046_IDG046 = null;
    }

    this.Ids = {in:[]};

    //Id cte evolog
    if(this.arIdIDG051.length > 0 ){
      for(let i of this.arIdIDG051){
        this.Ids.in.push(i.name)
      }
      objfilterAux.G051_IDG051 = this.Ids;
    }else{
      this.objFormFilter.controls['G051_IDG051'].setValue(null);
      objfilterAux.G051_IDG051 = null;
    }

    this.Ids = {in:[]};

    //Id CTRC
    if(this.arIdCDCTRC.length > 0 ){
      for(let i of this.arIdCDCTRC){
        this.Ids.in.push(i.name)
      }
      objfilterAux.G051_CDCTRC = this.Ids;
    }else{
      this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
      objfilterAux.G051_CDCTRC = null;
    }

    this.Ids = {in:[]};

    //Id Carga logos
    if(this.arIdIDCARLOG.length > 0 ){
      for(let i of this.arIdIDCARLOG){
        this.Ids.in.push(i.name)
      }
      objfilterAux.G046_IDCARLOG = this.Ids;
    }else{
      this.objFormFilter.controls['G046_IDCARLOG'].setValue(null);
      objfilterAux.G046_IDCARLOG = null;
    }

    this.Ids = {in:[]};

    if(Array.isArray(objfilterAux.G046_STCARGA)){
      if(objfilterAux.G046_STCARGA.length > 0){
        for(let objStatus of objfilterAux.G046_STCARGA){
          arrayIdStatus.push(objStatus.id);
        }
        objfilterAux.G046_STCARGA = {in: arrayIdStatus};
      }else{
        objfilterAux.G046_STCARGA = null;
      }
    }

    this.Ids = {in:[]};


    //DELIVERY
    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        this.Ids.in.push(i.name);
      }
      objfilterAux.G043_IDG043 = this.Ids;
    }else{
      this.objFormFilter.controls['G043_IDG043'].setValue(null);
      objfilterAux.G043_IDG043 = null;
    }

    this.Ids = {in:[]};

    //CODIGO DA DELIVERY
    if(this.arIdsCDDELIVE.length > 0 ){
      for(let i of this.arIdsCDDELIVE){
        this.Ids.in.push(i.name);
      }
      objfilterAux.G043_CDDELIVE = this.Ids;
    }else{
      this.objFormFilter.controls['G043_CDDELIVE'].setValue(null);
      objfilterAux.G043_CDDELIVE = null;
    }

    this.Ids = {in:[]};




    this.objfilter.value = objfilterAux
    this.grid.findDataTable(this.idDataGrid,'objfilter');

  }


    limpar(){
      this.objFormFilter.reset();
      this.objFormFilterH.reset();
      this.arIdIDG046 = [];
      this.arIdIDG051 = [];
      this.arIdCDCTRC = [];
      this.arIdIDCARLOG = [];
      //this.filtrar();
    }
    
  }
  //##############################



