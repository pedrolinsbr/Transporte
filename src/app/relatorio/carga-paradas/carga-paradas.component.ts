import { CargaParadasService } from '../../services/crud/carga-paradas.service';
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
  selector: 'app-carga-paradas',
  templateUrl: './carga-paradas.component.html',
  styleUrls: ['./carga-paradas.component.scss']
})
export class CargaParadasComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "CargaParadas";
  urlCargaParadasGrid = this.apiUrl+'tp/cargaParadas/listar'
  arBreadcrumbsLocal  = [];
  arIds               = [];
  exibir              = 1;
  collappsed          = null;
  objfilter = {value:null};


  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;

  //# modal
  modalRef: NgbModalRef;


    constructor(
      private mensagens : MensagensComponent,
      private cargaParadasService: CargaParadasService,
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

        IDG024:        [],
        G002RE_IDG002: [],
        G002DE_IDG002: [],
        IDG046:        [],
        DTCARGA:       [], 
        TPTRANSP:      [],
        DTSAICAR:      [], 
        SNCARPAR:      []

      });


      //# h015 --CONFIGURACAO
      this.objFormConfiguracao = formBuilder.group({

        IDG058:     [],
        NMCLIERE:   [],
        NMCLIEDE:   [],
        STCADAST:   [],
        IDS001:     [],
        IDG024:     [],
        CDESTADE:   [],
        CDESTARE:   []

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



  getSyngenta(obj){
    this.utilServices.loadGridShow();
    this.cargaParadasService.getSyngenta(obj).subscribe(
      data=>{
        this.objFormConfiguracao.controls['IDG024'].setValue(data.IDG024);
        this.objFormConfiguracao.controls['CDESTARE'].setValue(data.CDESTARE);
        this.objFormConfiguracao.controls['CDESTADE'].setValue(data.CDESTADE);

        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes Syngenta", "getSyngenta", obj.IDG036, "fa fa-map");
  }




  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
   Ids = {in:[]}
  filtrar(){
    this.Ids = {in:[]};
    let arCidadeDe = [];
    let arCidadeRe = [];
    let arTpTransp = [];


    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    if(this.arIds.length > 0 ){
      for(let i of this.arIds){
        this.Ids.in.push(i.name)
      }
      objfilterAux.IDG046 = this.Ids;
    }else{
      this.objFormFilter.controls['IDG046'].setValue(null);
      objfilterAux.IDG046 = null;
    }

    if(Array.isArray(objfilterAux.G002DE_IDG002)){

      if(objfilterAux.G002DE_IDG002.length > 0){
          for(let objresult of objfilterAux.G002DE_IDG002){
            arCidadeDe.push(objresult.id);
          }
          objfilterAux.G002DE_IDG002 = {in: arCidadeDe};
      }else{
          objfilterAux.G002DE_IDG002 = null;
      }
    }

    if(Array.isArray(objfilterAux.G002RE_IDG002)){

      if(objfilterAux.G002RE_IDG002.length > 0){
          for(let objresult of objfilterAux.G002RE_IDG002){
            arCidadeRe.push(objresult.id);
          }
          objfilterAux.G002RE_IDG002 = {in: arCidadeRe};
      }else{
          objfilterAux.G002RE_IDG002 = null;
      }
    }

    if(Array.isArray(objfilterAux.TPTRANSP)){

      if(objfilterAux.TPTRANSP.length > 0){
          for(let objresult of objfilterAux.TPTRANSP){
            arTpTransp.push(objresult.id);
          }
          objfilterAux.TPTRANSP = {in: arTpTransp};
      }else{
          objfilterAux.TPTRANSP = null;
      }
    }

    this.objfilter.value = objfilterAux
    this.grid.findDataTable(this.idDataGrid,'objfilter');
  }

    limpar(){
      this.objFormFilter.reset();
      this.arIds = [];
      this.filtrar();
    }
    
  }
  //##############################



