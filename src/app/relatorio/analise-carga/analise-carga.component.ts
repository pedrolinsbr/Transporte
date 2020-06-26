import { AnaliseCargaService } from '../../services/crud/analise-carga.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as $ from 'jquery';
import { DeliverysNewService } from '../../shared/componentesbravo/src/app/services/crud/deliveryNew.service';

@Component({
  selector: 'app-analise-carga',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './analise-carga.component.html',
  styleUrls: ['./analise-carga.component.scss']
})
export class AnaliseCargaComponent implements OnInit {


  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalCarga') modalCarga: any;
  @ViewChild('acc') private acc;

  @ViewChild('visaoUm')     visaoUm     : any;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "AnaliseCarga";
  urlAnaliseCargaGrid = this.apiUrl+'tp/analiseCarga/listar'
  arBreadcrumbsLocal  = [];
  arIds               = [];
  exibir              = 1;
  collappsed          = null;
  objfilter = {value:null};

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;

  data = new Date();
  showInfo = '';

  totalizador  = {qtdcargas:0, qtdctrc: 0, qtddelivery:0, qtdnota:0, qtdnotaentrega:0, psbruto:0, vrmercad:0, qtddisper: 0 };
  totalSeleci  = {qtdcargas:0, qtdctrc: 0, qtddelivery:0, qtdnota:0, qtdnotaentrega:0, psbruto:0, vrmercad:0, qtddisper: 0 };
  objfunction  = {visaoUm:false, visaoDois:false, visaoTres:false};

  //# modal
  modalRef: NgbModalRef;
  
  idCargaView: any;
  isSearched: boolean;
  cargaObj: any;
  arrRestricoes: any;
  paradasObj: any;
  errorFound: boolean;


    constructor(
      private mensagens : MensagensComponent,
      private AnaliseCargaService: AnaliseCargaService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      public utilServices: UtilServices,
      private modal : ModalComponent,
      private grid : DatagridComponent,
      public  translate: TranslateService,
      private modalService: NgbModal,
      public deliveryService: DeliverysNewService,
      public  vRef: ViewContainerRef

    )
    {

      const browserLang: string = translate.getBrowserLang();
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({

        G024_IDLOGOS:    [],
        G005_IDG005:     [],
        G046_IDG031M1:   [],
        G046_IDCARLOG:   [],
        G046_DTCARGA:    [],
        G046_DTSAICAR:   [],
        G046_TPTRANSP:   [],
        G046_TPMODCAR:   [],
        G030_IDG030:     [],
        G032V1_DSVEICUL: [],
        G046_STCARGA:    [],

        //lsDocumentos:   [],

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
      let aux2 = data.format('L');
  
      let auxB = aux2.split("/");
      let auxA = aux1.split("/");
      
      this.objFormFilter.controls['G046_DTCARGA'].setValue( 
        { endDate : {year: auxA[2], month: parseInt(auxA[1]), day: parseInt(auxA[0])}, 
          beginDate   : {year: auxB[2], month: parseInt(auxB[1]), day: parseInt(auxB[0])},
        formatted : aux2+" - "+aux1 } );

        this.objFormFilter.controls['G046_TPMODCAR'].setValue({id: "1", text: "3PL"});
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


  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
   Ids = {in:[]}
  filtrar(){
    this.Ids = {in:[]};
    //console.log(this.objFormFilter.controls['G046_TPMODCAR'].value);



    let objfilterAux = Object.assign({}, this.objFormFilter.value);
    //ATENÇÃO: SEMPRE RESETAR O arrayIds NO FINAL DE CADA PUSH 
    var arrayIds = [];

    if(objfilterAux.G046_TPMODCAR.id == 0){
      objfilterAux.G046_TPMODCAR = null;
    }

    if(Array.isArray(objfilterAux.G024_IDLOGOS)){
      if(objfilterAux.G024_IDLOGOS.length > 0){
        for(let objEmp of objfilterAux.G024_IDLOGOS){
          arrayIds.push(objEmp.id);
        }
        objfilterAux.G024_IDLOGOS = {in: arrayIds};
      }else{
        objfilterAux.G024_IDLOGOS = null;
      }
    }

    arrayIds = [];//

    if(Array.isArray(objfilterAux.G046_IDG031M1)){
      if(objfilterAux.G046_IDG031M1.length > 0){
        for(let objMotoristas of objfilterAux.G046_IDG031M1){
          arrayIds.push(objMotoristas.id);
        }
        objfilterAux.G046_IDG031M1 = {in: arrayIds};
      }else{
        objfilterAux.G046_IDG031M1 = null;
      }
    }

    arrayIds = [];//

    if(Array.isArray(objfilterAux.G005_IDG005)){
      if(objfilterAux.G005_IDG005.length > 0){
        for(let objCliente of objfilterAux.G005_IDG005){
          arrayIds.push(objCliente.id);
        }
        objfilterAux.G005_IDG005 = {in: arrayIds};
      }else{
        objfilterAux.G005_IDG005 = null;
      }
    }

    arrayIds = [];//

    //Combobox Multiplos de Veiculos
    if(Array.isArray(objfilterAux.G032V1_DSVEICUL)){
      if(objfilterAux.G032V1_DSVEICUL.length > 0){
          for(let objVeiculos of objfilterAux.G032V1_DSVEICUL){
            //Aqui o filtro é baseado na descricao do veículo, não no id do mesmo. OBS: No filtro mostra varias informações adicionais
          arrayIds.push(objVeiculos.dsveicul);
          }
          objfilterAux.G032V1_DSVEICUL = {in: arrayIds};
      }else{
          objfilterAux.G032V1_DSVEICUL = null;
      }
    }

    arrayIds = [];//

    //Combobox Multiplos de tipos de transporte
    if(Array.isArray(objfilterAux.G046_TPTRANSP)){
      if(objfilterAux.G046_TPTRANSP.length > 0){
          for(let objTpTransp of objfilterAux.G046_TPTRANSP){
          arrayIds.push(objTpTransp.id);
          }
          objfilterAux.G046_TPTRANSP = {in: arrayIds};
      }else{
          objfilterAux.G046_TPTRANSP = null;
      }
    }

    arrayIds = [];//

    //Combobox Multiplos de tipos de status
    if(Array.isArray(objfilterAux.G046_STCARGA)){
      if(objfilterAux.G046_STCARGA.length > 0){
          for(let objStatus of objfilterAux.G046_STCARGA){
          arrayIds.push(objStatus.id);
          }
          objfilterAux.G046_STCARGA = {in: arrayIds};
      }else{
          objfilterAux.G046_STCARGA = null;
      }
    }

    arrayIds = [];//

    

    this.objfilter.value = objfilterAux;
    this.grid.findDataTable(this.idDataGrid,'objfilter');

  }

  

    limpar(){
      this.objFormFilter.reset();
      this.arIds = [];
      
    }




    totalizadorGrid(){
      var visao = "";
      var visaoEach = "";
      
      visao = "visaoUm";
      visaoEach = 'input[type="hidden"][name^="obj_checkbox_AnaliseCarga_"]';
    
  
  
      
      this.totalizador.psbruto = 0;
      this.totalizador.vrmercad = 0;
      this.totalizador.qtddisper = 0;
      this.totalizador.qtdctrc = 0;
      this.totalizador.qtddelivery = 0;
      this.totalizador.qtdcargas = 0;
      this.totalizador.qtdnota = 0;
      this.totalizador.qtdnotaentrega = 0;
  
      var obj = this[visao].data_table.rows().data();

      console.log("G", obj);
  
      for (var i = obj.length - 1; i >= 0; i--) {
        this.totalizador.qtdcargas++;
        this.totalizador.qtdctrc += obj[i].QTDCTRC;
        this.totalizador.qtddelivery += obj[i].QTDDELIVERY;
        this.totalizador.qtdnota += obj[i].QTDNOTA;
        this.totalizador.qtdnotaentrega += obj[i].QTDNOTAENTREGA;
        this.totalizador.qtddisper += obj[i].QTDISPER;
        
        this.totalizador.psbruto += obj[i].PSCARGA;
        this.totalizador.vrmercad += obj[i].VRCARGA;
        
  
      }
      
  
     
  
        $(visaoEach).each(function (obj) {
            //console.log("Veio aqui");
            var jsonCte = null;
            var dsCte   = null;
            var flagCte = false;
  
            if(($(this).val()).DSCTE != null){
              jsonCte = JSON.parse($(this).val()).DSCTE;
              dsCte   = JSON.parse($(this).val()).DSCTE;
            }
  
            if(jsonCte != null){
              jsonCte = jsonCte.split(",");
              for (var i = jsonCte.length - 1; i >= 0 && flagCte == false; i--) {
                
              }
            }
        });
  
  
        
  
  
  
  
      this.totalSeleciGrid();
    }

    viewCarga(id) {

      this.idCargaView = id;
          // - Create Controller Obj
          let controllerG046 = {
            IDG046: this.idCargaView,
            G046: true,
            G048: true
          };
          
          this.deliveryService.getInfoCargaCompletaSemAcl(controllerG046).subscribe(
            data => {
              this.isSearched = true;
              this.cargaObj = data.G046;
              this.arrRestricoes = data.T004;
              this.paradasObj = data.G048;
              
            },
            err => {
              this.errorFound = true; // - Controller Error.
            }
          );
          this.modal.open(this.modalCarga, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
    }

    totalSeleciGrid(){
      ////debugger;
      this.grid.loadGridShow();
      var thisAux = this;
      var visao,json, visaoControl, lsDocumentosAux = null;
      var that  = {qtdcargas:0, qtdctrc: 0, qtddelivery:0, qtdnota:0, qtdnotaentrega:0, psbruto:0, vrmercad:0, qtddisper: 0};
  
      lsDocumentosAux = {ctrc:{visaoUm:"", visaoDois:"", visaoTres:""}, delivery:{visaoUm:"", visaoDois:"", visaoTres:""}};
  
        visao = 'input[type="hidden"][name^="obj_checkbox_AnaliseCarga_"]';
        visaoControl = "visaoUm";
      
  
       $($(visao).parent()).each(function (obj) {
         //debugger;
         //console.log('>>>>>', $($(this).children()[0]).prop("checked"));
        if($($(this).children()[0]).prop("checked")){
            json  = JSON.parse($($(this).children()[1]).val());
            //console.log(json);
            that.qtdcargas++;
            that.qtdctrc += json.QTDCTRC;
            that.qtddelivery += json.QTDDELIVERY;
            that.qtdnota += json.QTDNOTA;
            that.qtdnotaentrega += json.QTDNOTAENTREGA;
            that.psbruto += json.PSCARGA;
            that.vrmercad += json.VRCARGA;
            that.qtddisper += json.QTDISPER;
            
            if(json.DSCTE != null){
              lsDocumentosAux.ctrc[visaoControl] = lsDocumentosAux.ctrc[visaoControl] + "," + json.DSCTE;
              
            }
            if(json.DSNFE != null){
              lsDocumentosAux.delivery[visaoControl] = lsDocumentosAux.delivery[visaoControl] + "," + json.DSNFE;
              
            }
  
        }
      });
  
      this.totalSeleci = that;
      
  
      if(!this.objfunction[visaoControl]){
        $($(visao).parent()).off('click');
        $($(visao).parent()).click({ obj: this }, function (e) {
           thisAux.totalSeleciGrid();
        });
        
      }
      this.grid.loadGridHide();
    }
    
  }
  //##############################



