// #### ANGULAR
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

// #### SERVICE
import { MdfeService    } from './../services/geral/mdf-e.service';
import { UtilServices    } from './../shared/componentesbravo/src/app/services/util.services';
import { DragulaService  } from 'ng2-dragula';
import { ToastrService   } from 'ngx-toastr';
import { GlobalsServices } from '../services/globals.services';
import { InfoParadas } from '../shared/componentesbravo/src/app/models/info-paradas.model';

// #### COMPONENTES
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { DeliverysNewService } from '../shared/componentesbravo/src/app/services/crud/deliveryNew.service';

declare var google: any;

@Component({
  selector: 'app-mdf-e',
  templateUrl: './mdf-e.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./mdf-e.component.scss']
})
export class MdfeComponent implements OnInit {
  private global = new GlobalsServices();

  //##### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs : any;
  @ViewChild('indicador') indicador: any;
  @ViewChild('modalLocalColeta') modalLocalColeta: any;
  @ViewChild('modalTrocaStatus') modalTrocaStatus: any;
  @ViewChild('modalCarga') modalCarga: any;

  @Input() mostrarMapa: any = false;

  //##### FORMS
  objFormFilter  : FormGroup;
  objFormGerarMdf: FormGroup;
  objFormSaveMdf : FormGroup;
  objFormModel   : FormGroup;
  objFormColeta  : FormGroup;
  objFormCancel  : FormGroup;

  //##### STRING
  url            = this.global.getApiHost();
  titleCard      : any; 
  controlView    = 'O';
  snUf           = 'S';
  localColeta    = '';
  titlePanel     = '';
  titleModal     = '';
  aux            : any;
  cargaObj: any;//InfoCarga;

  //##### BOOLEAN
  collapsedFilter  = true;
  controlColumns   = false;
  disabled         = false;
  controlEditar    = false;
  public errorFound: boolean = false;
  public isSearched: boolean = false;

  //##### INT
  controlViewTable    = 1;
  controlCarregamento = 1;
   idCargaView        = 0;

  //##### ARRAYS//OBJECTS
  arBreadcrumbsLocal = [];
  arIdsIDG046   = [];
  arIdsNRMDFE   = [];
  arIdsNRCHAMDF = [];
  arIdCarLog    = [];
  arGridPercurso   = [];
  arrRestricoes = [];
  paradasObj: InfoParadas[];
  obj = [];
  objStyle      = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };
  objfilter = {value:null};

  //##### URL
  urlMdfeGrid  = this.url+'tp/mdfe/listar';
  apiUrl       = localStorage.getItem('URL_API');
  indicadores = {
    url: this.url + "tp/mdfe/indicadoresMdfe?tp=1",
    cardsNum: [0, 1, 2]
  };

  constructor(
    private modalService   : NgbModal,
    private formBuilder    : FormBuilder,
    public  mdfeService    : MdfeService,
    private dragulaService : DragulaService,
    private modal          : ModalComponent,
    public  toastr         : ToastrService,
    public  translate      : TranslateService,
    public  utils          : UtilServices,
    private grid           : DatagridComponent,
    public deliveryService : DeliverysNewService,
  ) {

    const browserLang: string = translate.getBrowserLang();

    translate.use(localStorage.getItem('DSINTERN'));

    this.objFormFilter = formBuilder.group({
      IDG024            : [],
      DTCARGA           : [],
      IDG046            : [],
      DTMANIFE          : [],
      NRMDF             : [],
      NRCHAMDF          : [],
      STMDF             : [],
      IDG032            : [],
      IDCARLOG          : [],
      IDG031M1          : []
    });
    
    this.objFormColeta = formBuilder.group({
      TPLOCOLE          : [[], [Validators.required]]
    });

    this.objFormCancel = formBuilder.group({
      DSCANCEL          : ['', [Validators.required]]
    });

    this.objFormGerarMdf = formBuilder.group({
        IDF001            : [],
        IDG024            : [], 
        IDG046            : [],
        IDG048            : [],
        OBS               : [''],
        TPLOCOLE          : [],
        UFINICIO          : [],
        UFFINAL           : [],
        UF1               : [],
        UF2               : [],
        UF3               : [],
        UF4               : [],
        UF5               : [],
        UF6               : [],
        UF7               : [],
        UF8               : [],
        DSCANCEL          : [],
        IDCARLOG          : [],
        DSVEICULV1        : [],
        DSVEICULV2        : [],
        DSVEICULV3        : [],
        NMMOTORIM1        : [],
        NMMOTORIM2        : [],
        NMMOTORIM3        : [],
    });

   }

  ngOnInit() {
    //this.functitleCard();
    //this.filtrar();
    //this.controlViewTable = 1;
  }

  formDinamico(qtd){
    var a = {};

    for (let k = 0; k < qtd; k++) {
        a['PERCURSO'+k] = [];

        this['objFormGerarMdf'+k] = this.objFormModel;
        this['objFormGerarMdf'+k] = this.formBuilder.group({
            IDF001            : [],
            IDG024            : [], // ID TRANSPORTADORA
            IDG046            : [],
            IDG048            : [],
            TPLOCOLE          : [],
            UFINICIO          : [],
            UFFINAL           : [],
            UF1               : [],
            UF2               : [],
            UF3               : [],
            UF4               : [],
            UF5               : [],
            UF6               : [],
            UF7               : [],
            UF8               : [],
            OBS               : [],
            VER               : [],
            IDCARLOG          : [],
            DSVEICULV1        : [],
            DSVEICULV2        : [],
            DSVEICULV3        : [],
            NMMOTORIM1        : [],
            NMMOTORIM2        : [],
            NMMOTORIM3        : [],
        });
        this['objFormGerarMdf'+k].controls['VER'].setValue(0);
    }
    this.objFormSaveMdf = this.formBuilder.group(a);
  }

  alterViewObs(i,tipo){
    
    if(tipo == 1){
        this['objFormGerarMdf'+i].controls['VER'].setValue(1);
    }else{
        this['objFormGerarMdf'+i].controls['VER'].setValue(0);
    }
    
  }

  functitleCard(){
    switch(this.controlView){
        case 'O':
            this.titleCard = 'Não processado';
        break;
        case 'P':
            this.titleCard = 'Pendente';
        break;
        case 'N':
            this.titleCard = 'Não enviado';
        break;
        case 'A':
            this.titleCard = 'Autorizado';
        break;
        case 'E':
            this.titleCard = 'Erro';
        break;
        case 'C':
            this.titleCard = 'Cancelado';
        break;
        case 'R':
            this.titleCard = 'Encerrado';
        break;
        case 'G':
            this.titleCard = 'Aguardando documentos';
        break;
        case 'M':
            this.titleCard = 'Sol. Encerramento';
        break;
        case 'L':
            this.titleCard = 'Sol. Cancelamento';
        break;
        default:
            this.titleCard = 'Todos';
        break;
    }
  }

  //############  START FUNCTIONS OF BREADCRUMBS  ######################
  set(id, name, functionName,parameter, icon){//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    console.log('inicio do show');
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    console.log('inicio laço show');
    for(let item of this.arBreadcrumbsLocal){
      if(item.id == data.id || item.name == name){
        valid = false;
      }
    }
    console.log('fim laço show');
    if(valid){
      this.arBreadcrumbsLocal.push(data);
    }
    console.log('fim do show');
  }

  goHome(event = null){ //IR PARA TELA INICIAL
    this.arBreadcrumbsLocal = [];
    this.controlViewTable = 1;
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

  limpar(){
    this.arIdsIDG046.length   = 0;
    this.arIdsNRMDFE.length   = 0;
    this.arIdsNRCHAMDF.length = 0;
    this.arIdCarLog.length    = 0;
    this.objFormFilter.reset();
    this.filtrar();
  }

  idsCarga    = {in:[]}
  idsNrMdfe   = {in:[]}
  idsNrChamdf = {in:[]}
  idsCarLog   = {in:[]}

  filtrar(stmdf = ''){
    this.grid.loadGridShow();
    this.controlCarregamento = 0;
    this.controlView = stmdf == '' ? this.controlView : stmdf;

    console.log("flag::::", stmdf);
    console.log("controlView::::", this.controlView);

    if(this.controlView != 'O' && this.controlView != 'G'){
        this.controlColumns = true;
    }else{
        this.controlColumns = false;
    }
    console.log('controlColumns',this.controlColumns);
    this.idsCarga    = {in:[]};
    this.idsNrMdfe   = {in:[]};
    this.idsNrChamdf = {in:[]};
    let objfilterAux = Object.assign({}, this.objFormFilter.value);

    if(this.controlView != null){
        objfilterAux.STMDF = this.controlView;
        this.objFormFilter.controls['STMDF'].setValue(this.controlView);
    }else{
        objfilterAux.STMDF = 'O';
        this.objFormFilter.controls['STMDF'].setValue(this.controlView);
    }

    if(this.arIdsIDG046.length > 0 ){
      for(let i of this.arIdsIDG046){
        this.idsCarga.in.push(i.name)
      }
      objfilterAux.IDG046 = this.idsCarga;
    }else{
      this.objFormFilter.controls['IDG046'].setValue(null);
      objfilterAux.IDG046 = null;
    }

    if(this.arIdsNRMDFE.length > 0 ){
      for(let i of this.arIdsNRMDFE){
        this.idsNrMdfe.in.push(i.name)
      }
      objfilterAux.NRMDF = this.idsNrMdfe;
    }else{
      this.objFormFilter.controls['NRMDF'].setValue(null);
      objfilterAux.NRMDF = null;
    }

    
    if(this.arIdsNRCHAMDF.length > 0 ){
      for(let i of this.arIdsNRCHAMDF){
        this.idsNrChamdf.in.push(i.name)
      }
      objfilterAux.NRCHAMDF = this.idsNrChamdf;
    }else{
      this.objFormFilter.controls['NRCHAMDF'].setValue(null);
      objfilterAux.NRCHAMDF = null;
    }

    if(this.arIdCarLog.length > 0 ){
      for(let i of this.arIdCarLog){
        this.idsCarLog.in.push(i.name)
      }
      objfilterAux.IDCARLOG = this.idsCarLog;
    }else{
      this.objFormFilter.controls['IDCARLOG'].setValue(null);
      objfilterAux.IDCARLOG = null;
    }

    console.log('objfilterAux',objfilterAux);
    this.objfilter.value = objfilterAux;
    this.indicador.getDadosReload();
    this.functitleCard();
    this.grid.findDataTable('mdfe','objfilter');
   
  }

  informarLocCol(obj){

    this.obj = JSON.parse(obj);
    console.log('infColeta',this.obj);
    if(this.obj['STMDF'] == 'O' || this.obj['STMDF'] == 'R'){
      this.modal.open(this.modalLocalColeta);
    }else{
      if(this.obj['STMDF'] != 'G'){
        this.toastr.warning('Esta carga já possui MDF-e.');
      }else{
        this.controlEditar = false;
        this.toastr.warning('Esta carga não possui vínculo com nenhum CTE ativo.');
      }
      
      this.grid.loadGridHide();
    }

    /*Data: 26/06/2019
      Motivo: Esse código está comentado, pois iremos implementar o agrupamento de cargas no futuro

      if(obj.length == 0){
        this.toastr.warning("Selecione no mínimo uma carga");
      }else{
        var json;
        let selecionados = [];
        $($('input[type="hidden"][name^="obj_checkbox_carga_').parent()).each(function (obj) {
          if($($(this).children()[0]).prop("checked")){
            json  = JSON.parse($($(this).children()[1]).val());
            selecionados.push(json);
          }
        });
        console.log('>>>>>',selecionados);
      }*/
  }

  validarCarga(){
    console.log('===',this.obj);
    this.grid.loadGridShow();

    if(!this.controlEditar){
      let obj = this.obj;
      this.mdfeService.validarCarga({obj}).subscribe(
        data=>{
          console.log(data);
          if(data.response != ""){
            this.toastr.warning(data.response, "",{closeButton: true, disableTimeOut: true, tapToDismiss: false});
            this.objFormColeta.reset();
            this.grid.loadGridHide();
            this.modal.closeModal();
          }else{
            this.gerar();
          }

        },
        err=>{
          this.objFormColeta.reset();
          this.toastr.error('Erro na validação da carga.');
          this.grid.loadGridHide();
          this.modal.closeModal();
          this.goHome(event);
        }
      );

    }else{
      this.gerar();
    }
  }

  gerar(){

    console.log('===',this.obj);

    if(!this.controlEditar){
      this.titlePanel = 'Gerar MDF-e: Carga '+this.obj['IDG046']+' '+this.obj['DSCARGA'];
      if(this.validarFormularioValido(this.objFormColeta)){
        this.obj['TPLOCOLE'] = this.objFormColeta.controls['TPLOCOLE'].value;
        this.controlViewTable = 2;
        this.disabled         = false;
        this.controlEditar    = false;
        let obj               = this.obj;
        
        this.mdfeService.buscaPercurso({obj}).subscribe(
          data=>{
            console.log("DATA === >> ",data);
            this.formDinamico(data.length);
            this.arGridPercurso = data;
            for (let k = 0; k < this.arGridPercurso.length; k++) {
                this['objFormGerarMdf'+k].controls['IDG024'].setValue(this.arGridPercurso[k]['IDG024']);
                this['objFormGerarMdf'+k].controls['IDG046'].setValue(this.arGridPercurso[k]['IDG046']);
                this['objFormGerarMdf'+k].controls['IDG048'].setValue(this.arGridPercurso[k]['IDG048']);
                this['objFormGerarMdf'+k].controls['TPLOCOLE'].setValue(this.obj['TPLOCOLE'].id);
                this['objFormGerarMdf'+k].controls['UFINICIO'].setValue({id: this.arGridPercurso[k]['CDUFOR'] , text: this.arGridPercurso[k]['UFOR']});
                this['objFormGerarMdf'+k].controls['UFFINAL'].setValue({id: this.arGridPercurso[k]['CDUFDE'] , text: this.arGridPercurso[k]['UFDE']});
                this['objFormGerarMdf'+k].controls['IDCARLOG'].setValue(this.arGridPercurso[k]['IDCARLOG']);
                this['objFormGerarMdf'+k].controls['NMMOTORIM1'].setValue(this.arGridPercurso[k]['NMMOTORIM1']);
                this['objFormGerarMdf'+k].controls['NMMOTORIM2'].setValue(this.arGridPercurso[k]['NMMOTORIM2']);
                this['objFormGerarMdf'+k].controls['NMMOTORIM3'].setValue(this.arGridPercurso[k]['NMMOTORIM3']);
                this['objFormGerarMdf'+k].controls['DSVEICULV1'].setValue(this.arGridPercurso[k]['DSVEICULV1']);
                this['objFormGerarMdf'+k].controls['DSVEICULV2'].setValue(this.arGridPercurso[k]['DSVEICULV2']);
                this['objFormGerarMdf'+k].controls['DSVEICULV3'].setValue(this.arGridPercurso[k]['DSVEICULV3']);
            }
            this.objFormColeta.reset();
            this.grid.loadGridHide();
            this.modal.closeModal();
            
          },
          err=>{
            this.objFormColeta.reset();
            this.toastr.error('Erro na listagem do percurso.');
            this.grid.loadGridHide();
            this.modal.closeModal();
            this.goHome(event);
          }
        );
      }else{
        this.objFormColeta.reset();
        this.toastr.error('Selecione o local de coleta, por favor.');
        this.grid.loadGridHide();
      }
    }else{
      this.editar();
    }
  }

  salvarMdfe(){
    this.grid.loadGridShow();

    if(this.controlEditar){
      //Editar MDF-e
      this.objFormSaveMdf.reset();
      //console.log(this.obj['TPLOCOLE']);
      this.objFormSaveMdf             = this['objFormGerarMdf0'].value;
      this.objFormSaveMdf['UFINICIO'] = {id: this['objFormGerarMdf0'].controls['UFINICIO'].value.id , text: this['objFormGerarMdf0'].controls['UFINICIO'].value.text  };
      this.objFormSaveMdf['UFFINAL']  = {id: this['objFormGerarMdf0'].controls['UFFINAL'].value.id  , text: this['objFormGerarMdf0'].controls['UFFINAL'].value.text };
      this.objFormSaveMdf['QTD']      = this.arGridPercurso.length;
      this.objFormSaveMdf['USERID']   = localStorage.getItem('ID_USER');
      this.objFormSaveMdf['TPLOCOLE'] = this.obj['TPLOCOLE'].id;
      this.objFormSaveMdf['IDCARLOG'] = this.obj['IDCARLOG'];

      this.mdfeService.atualizarMdfe(this.objFormSaveMdf).subscribe(
        data=>{
          this.toastr.success(data.response, "Sucesso",{closeButton: true, disableTimeOut: true, tapToDismiss: false});
          this.objFormGerarMdf.reset();
          
          this.grid.loadGridHide();
          this.goHome();
        },
        err=>{
         console.log('Ops >>>> ', err);
         this.toastr.error(err.error.response);
         this.grid.loadGridHide();

        }
      );

    }else{
      //Inserir novos MDF-e
      for (let k = 0; k < this.arGridPercurso.length; k++) {
           this.objFormSaveMdf.value['PERCURSO'+k]             = this['objFormGerarMdf'+k].value;
           this.objFormSaveMdf.value['PERCURSO'+k]['UFINICIO'] = {id: this.arGridPercurso[k]['CDUFOR'] , text: this.arGridPercurso[k]['UFOR']};
           this.objFormSaveMdf.value['PERCURSO'+k]['UFFINAL']  = {id: this.arGridPercurso[k]['CDUFDE'] , text: this.arGridPercurso[k]['UFDE']};
      }
      this.objFormSaveMdf.value['QTD']    = this.arGridPercurso.length;
      this.objFormSaveMdf.value['USERID'] = localStorage.getItem('ID_USER');
    
      this.mdfeService.salvarMdfe(this.objFormSaveMdf.value).subscribe(
          data=>{
            this.toastr.success(data.response, "Sucesso",{closeButton: true, disableTimeOut: true, tapToDismiss: false});
            this.objFormGerarMdf.reset();
            this.objFormSaveMdf.reset();
            this.goHome();
            this.grid.loadGridHide();
          },
          err=>{
           console.log('Ops >>>> ', err);
           this.toastr.error(err.error.response);
           this.grid.loadGridHide();
  
          }
        );
    }

  }

  validarFormularioValido(objForm) {
    if (objForm.valid) {
      return true;
    } else {
      return false;
    }
  }

  visualizar(obj){

    this.grid.loadGridShow();

    obj        = JSON.parse(obj);
    let status = this.validarStatusMdf(obj['STMDF']);

    if(status){
      
      this.controlViewTable = 2;
      this.controlEditar    = false;
    
      this.mdfeService.buscaMdfe({obj}).subscribe(
        data=>{
          console.log("DATA === >> ",data);
          this.formDinamico(1);
         
          for (let k = 0; k < data.length; k++) {
              
              if((k+1) == 1){
                this['objFormGerarMdf0'].controls['VER'].setValue(1);
                this['objFormGerarMdf0'].controls['OBS'].setValue(data[k]['DSMDF']);
                this['objFormGerarMdf0'].controls['IDG024'].setValue(data[k]['IDG024']);
                this['objFormGerarMdf0'].controls['IDG046'].setValue(data[k]['IDG046']);
                this['objFormGerarMdf0'].controls['IDG048'].setValue(data[k]['IDG048']);
                this['objFormGerarMdf0'].controls['TPLOCOLE'].setValue(data[k]['TPLOCOLE']);
                this['objFormGerarMdf0'].controls['UFINICIO'].setValue({id: data[k]['IDG002'] , text: data[k]['CDESTADO']});
                this['objFormGerarMdf0'].controls['NMMOTORIM1'].setValue(data[k]['NMMOTORIM1']);
                this['objFormGerarMdf0'].controls['NMMOTORIM2'].setValue(data[k]['NMMOTORIM2']);
                this['objFormGerarMdf0'].controls['NMMOTORIM3'].setValue(data[k]['NMMOTORIM3']);
                this['objFormGerarMdf0'].controls['DSVEICULV1'].setValue(data[k]['DSVEICULV1']);
                this['objFormGerarMdf0'].controls['DSVEICULV2'].setValue(data[k]['DSVEICULV2']);
                this['objFormGerarMdf0'].controls['DSVEICULV3'].setValue(data[k]['DSVEICULV3']);
              }else if((k+1) == data[k]['COUNT']){
                this.titlePanel       = 'Visualizar MDF-e: Carga '+data[k]['IDG046']+' '+data[k]['DSCARGA'];
                this['objFormGerarMdf0'].controls['UFFINAL'].setValue({id: data[k]['IDG002'] , text: data[k]['CDESTADO']});
              }else{
                this['objFormGerarMdf0'].controls['UF'+k].setValue({id: data[k]['IDG002'] , text: data[k]['CDESTADO']});
              }
          }
          this.disabled       = true;
          this.arGridPercurso = [this['objFormGerarMdf0'].value];
          this.objFormColeta.reset();
          this.grid.loadGridHide();

        },
        err=>{
          this.objFormColeta.reset();
          this.toastr.error('Erro na listagem do percurso.');
          this.goHome();
          this.grid.loadGridHide();
        }
      );
    }else{
      this.grid.loadGridHide();
    }
    
  }

  editarLocCol(obj){
    this.objFormColeta.reset();
    this.obj   = JSON.parse(obj);

    if(this.obj['STMDF'] == 'E'){

      this.controlEditar = true;
      
      if(this.obj['TPLOCOLE'] == 1){
        this.objFormColeta.controls['TPLOCOLE'].setValue({id:this.obj['TPLOCOLE'],text:'Filial'});
      }else if(this.obj['TPLOCOLE'] == 2){
        this.objFormColeta.controls['TPLOCOLE'].setValue({id:this.obj['TPLOCOLE'],text:'Cliente'});
      }
      this.modal.open(this.modalLocalColeta);
      this.grid.loadGridHide();

    }else{
      this.toastr.warning('Só é permitido editar MDF-e com a situação de erro.');
      this.grid.loadGridHide();
    }
    
  }

  editar(){

    this.grid.loadGridShow();
    //console.log('TPLOCOLE==',this.objFormColeta.controls['TPLOCOLE'].value);
    this.obj['TPLOCOLE']  = this.objFormColeta.controls['TPLOCOLE'].value;
    this.controlViewTable = 2;
    let obj               = this.obj;
   //console.log('obj==',obj);
    this.mdfeService.buscaMdfe({obj}).subscribe(
      data=>{
        console.log("DATA === >> ",data);
        this.formDinamico(1);
        this.arGridPercurso = [data];
        this.aux = data;
        for (let k = 0; k < this.aux.length; k++) {
          if(k == 0){
            this['objFormGerarMdf0'].controls['VER'].setValue(1);
            this['objFormGerarMdf0'].controls['OBS'].setValue(this.aux[k]['DSMDF']);
            this['objFormGerarMdf0'].controls['IDG024'].setValue(this.aux[k]['IDG024']);
            this['objFormGerarMdf0'].controls['IDF001'].setValue(this.aux[k]['IDF001']);
            this['objFormGerarMdf0'].controls['IDG046'].setValue(this.aux[k]['IDG046']);
            this['objFormGerarMdf0'].controls['IDG048'].setValue(this.aux[k]['IDG048']);
            this['objFormGerarMdf0'].controls['TPLOCOLE'].setValue(this.aux[k]['TPLOCOLE']);
            this['objFormGerarMdf0'].controls['UFINICIO'].setValue({id: this.aux[k]['CDUFOR'] , text: this.aux[k]['UFOR']});
            this['objFormGerarMdf0'].controls['NMMOTORIM1'].setValue(this.aux[k]['NMMOTORIM1']);
            this['objFormGerarMdf0'].controls['NMMOTORIM2'].setValue(this.aux[k]['NMMOTORIM2']);
            this['objFormGerarMdf0'].controls['NMMOTORIM3'].setValue(this.aux[k]['NMMOTORIM3']);
            this['objFormGerarMdf0'].controls['DSVEICULV1'].setValue(this.aux[k]['DSVEICULV1']);
            this['objFormGerarMdf0'].controls['DSVEICULV2'].setValue(this.aux[k]['DSVEICULV2']);
            this['objFormGerarMdf0'].controls['DSVEICULV3'].setValue(this.aux[k]['DSVEICULV3']);
  
          }else if((k+1) == this.aux[k]['COUNT']){
            this.titlePanel       = 'Editar MDF-e: Carga '+data[k]['IDG046']+' '+data[k]['DSCARGA'];
            this['objFormGerarMdf0'].controls['UFFINAL'].setValue({id: this.aux[k]['IDG002'] , text: this.aux[k]['CDESTADO']});
          }else{
            this['objFormGerarMdf0'].controls['UF'+k].setValue({id: this.aux[k]['IDG002'] , text: this.aux[k]['CDESTADO']});
          }
      }
      this.disabled = false;
      this.objFormColeta.reset();
      this.grid.loadGridHide();
      this.modal.closeModal();
      },
      err=>{
        this.objFormColeta.reset();
        this.toastr.error('Erro na listagem do percurso.');
        this.grid.loadGridHide();

      }
    );
    
  }

  gerarXml(obj){

    obj        = JSON.parse(obj);
    let status = this.validarStatusMdf(obj.STMDF);

    if(status){

      let objParam = {
        IDF001: obj.IDF001
      }

      this.mdfeService.downloadXmlMdfe(objParam).subscribe(
        data => {

          console.log('receipt data');
          console.log(data);
          
          let url       = window.URL.createObjectURL(data);
          let link      = document.createElement('a');
          link.href     = url;
          link.download = 'MDF-e_'+obj.IDF001+'.xml';
          link.dispatchEvent(new MouseEvent('click'));
        }, err => {
          console.log(err);
          this.toastr.error('Não existe XML para este MDF-e.');
        }
      )
    }
  
  }

  validarPdf(obj){

    obj = JSON.parse(obj);

    if(obj.STMDF == 'A' || obj.STMDF == 'R'){

      let objParam = {
        IDF001: obj.IDF001
      }

      this.mdfeService.validarPdfMdfe(objParam).subscribe(
        data => {

          console.log('receipt data');
          console.log(data);

          if(data[0].QTD > 0){
            this.toastr.error('N° do MDF-e não condiz com o XML, por favor entre em contato com o setor de suporte ao sistema.');
          }else{
            this.gerarPdf(objParam);
          }
          
        }, err => {
          console.log(err);
          this.toastr.error('Não existe XML para este MDF-e para gerarmos o pdf.');
        }
      )
    }else{
      this.toastr.warning('O pdf ficará disponível quando o MDF-e for autorizado.');
    }
  
  }

  gerarPdf(objParam){

      this.mdfeService.downloadPdfMdfe(objParam).subscribe(
        data => {

          console.log('receipt data');
          console.log(data);
          
          let url       = window.URL.createObjectURL(data);
          let link      = document.createElement('a');
          link.href     = url;
          link.download = 'MDF-e_'+objParam.IDF001+'.pdf';

          link.dispatchEvent(new MouseEvent('click'));
        }, err => {
          console.log(err);
          this.toastr.error('Não existe XML para este MDF-e para gerarmos o pdf.');
        }
      )

  
  }

  visualizarPdf(obj){

    obj = JSON.parse(obj);

    if(obj.STMDF == 'A' || obj.STMDF == 'R'){

      var url_atual = window.location.href;
      url_atual = url_atual.split('#')[0];
      url_atual = url_atual +'#/';

      console.log(url_atual+'mdf-e/visualizar/'+obj.IDF001);
      console.log(url_atual);
      window.open(url_atual+'mdf-e/visualizar/'+obj.IDF001, '_blank');

    }else{
      this.toastr.warning('O pdf ficará disponível quando o MDF-e for autorizado.');
    }
  
  }

  validarStatusMdf(status){
    if(status == 'O'){
      this.toastr.warning('Esta carga não possui MDF-e.');
      this.grid.loadGridHide();
      return false;
    }else if(status == 'G'){
      this.toastr.warning('Esta carga não possui vínculo com nenhum CTE ativo.');
      this.grid.loadGridHide();
      return false;
    }else{
      return true;
    }
  }

  abrirModalEncerrar(obj){
    console.log(obj);
    obj = JSON.parse(obj);
    if(obj['STMDF'] == 'A' || obj['STMDF'] == 'L'){
      this.obj = obj;
      this.titleModal = 'Solicitar Encerramento do MDF-e';
      this.obj['STMDF'] = 'M';
      this.modal.open(this.modalTrocaStatus);
    }else{
      this.toastr.warning('Esta ação é permitida somente com o MDF-e na situação de autorizado ou quando é solicitado o cancelamento.');
      this.grid.loadGridHide();
    }

  }

  abrirModalCancelar(obj){
    obj = JSON.parse(obj);
    console.log(obj);
    if(obj['STMDF'] == 'A' || obj['STMDF'] == 'M'){
      this.obj          = obj;
      this.titleModal   = 'Solicitar Cancelamento do MDF-e'
      this.obj['STMDF'] = 'L';
      this.modal.open(this.modalTrocaStatus);
    }else{
      this.toastr.warning('Esta ação é permitida somente com o MDF-e na situação de autorizado ou quando é solicitado o encerramento.');
      this.grid.loadGridHide();
    }
  }

  salvarTrocaStatus(){

    this.grid.loadGridShow();
    var verificar = true;

    if(this.obj['STMDF'] == 'L'){
      if(this.validarFormularioValido(this.objFormCancel)){

        this.obj['DSCANCEL'] = this.objFormCancel.value.DSCANCEL.replace(/\s{2,}/g, ' ');

        if(this.obj['DSCANCEL'].length <= 30){
          this.toastr.error('O campo Justificativa do cancelamento deve ter mais de 30 caracteres.');
          this.grid.loadGridHide();
          verificar = false;
        }

      }else{
        this.toastr.error('Preencha o campo Justificativa do cancelamento, por favor.');
        this.grid.loadGridHide();
        verificar = false;
      }
  
    }  
    
    if(verificar){
      this.obj['USERID']  = localStorage.getItem('ID_USER');
      this.mdfeService.salvarTrocaStatus(this.obj).subscribe(
        data=>{
          console.log(data);

          this.toastr.success(data.response, "Sucesso",{closeButton: true, disableTimeOut: true, tapToDismiss: false});
          this.grid.loadGridHide();
          this.modal.closeModal();

          this.filtrar();

        },
        err=>{
          this.objFormCancel.reset();
          console.log('Ops >>>> ', err);
          this.modal.closeModal();
          this.grid.loadGridHide();
          this.toastr.error(err.error.response);
          

        }
      );

    }
  }

  viewCarga(id) {
    this.mostrarMapa = true;

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

}
