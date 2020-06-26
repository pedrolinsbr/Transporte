import { ParametrosService } from './../../services/crud/parametros.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
//services
import { RotasService } from './../../services/crud/rotas.service';

@Component({
  selector: 'app-rotas',
  templateUrl: './rotas.component.html',
  styleUrls: ['./rotas.component.scss']
})
export class RotasComponent implements OnInit {
  apiService: any;

  // ##### ANCHORS
  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  // ##### URL'S
  apiUrl              = localStorage.getItem('URL_API');
  urlRotaGrid         = this.apiUrl+'tp/rota/listarRota';
  urlRotaGridCidade   = this.apiUrl+'tp/rota/listarCidade';
  urlRotaGridClientes = this.apiUrl+'tp/rota/listarCliente';
  urlFiltroRota       = this.apiUrl+'filtro/buscarRotas';
  urlFiltroClientes   = this.apiUrl+'filtro/clientes';

  // ##### ARRAYS // OBJECTS
  arBreadcrumbsLocal  = [];

  // ##### ID'S
  idRota              = null;
  idDataGrid          = "rotas";
  idCliente           : any;
  idCidade            : any;
  idTransp            : any;
  nmFunctionDelete    : any;


  // ##### VALIDATORS VIEW
  butsEdit            = false;
  butsNew             = true;
  viewGrid            = true;
  collappsed          = null;
  checkViewDePara     = 0;
  checkSaveCliente    = true;
  checkSaveCidade     = true;
  exibir              = 1;
  mostraDias          = true;
  
  /*
    STATUS EXIBIR
    1 - GRID ROTAS // HOME
    2 - ROTA - EDITAR // VISUALIZAR // INSERIR
    3 - GRID CIDADES
    4 - GRID CLIENTES
    5 - CLIENTE - EDITAR // VISUALIZAR // INSERIR
    6 - CIDADE - EDITAR // VISUALIZAR // INSERIR
  */

  // ##### FORMS
  objFormFilter:   FormGroup;
  objFormRota:   FormGroup;
  objFormCidade:  FormGroup;
  objFormCliente: FormGroup;
  objfilter       = {value:null};

  // ###### MODAL
  modalRef: NgbModalRef;

  globalTelaCit:any = [{'id' : 'excel'},{'id' : 'colvis'}];
  acoesTelaCit = [{'id' : 1, 'metodo' : 'viewCidade',   'icone': 'fa fa-eye'}];  

  globalTelaCli:any = [{'id' : 'excel'},{'id' : 'colvis'}];
  acoesTelaCli = [{'id' : 1, 'metodo' : 'viewCidade',   'icone': 'fa fa-eye'}];
    
  

    constructor(
      private mensagens : MensagensComponent,
      private rotasService: RotasService,
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
        IDT001         :[[]],   //Rotas vem aqui     
        IDG024         :[],
        T003_IDG005    :[[]],
        IDT005         :[],
        G003_IDG003    :[],
        SNDIA0_filter  :[],
        SNDIA1_filter  :[],
        SNDIA2_filter  :[],
        SNDIA3_filter  :[],
        SNDIA4_filter  :[],
        SNDIA5_filter  :[],
        SNDIA6_filter  :[],
        CALEND         :[],
      });


      //# T001 -- FORM ROTAS
      this.objFormRota = formBuilder.group({
        IDT001  : [],
        IDG024  : ['', [Validators.required]],
        DSPRACA : ['', [Validators.required]],
        STCADAST: ['', [Validators.required]],
        SNDIA0: [],
        SNDIA1: [],
        SNDIA2: [],
        SNDIA3: [],
        SNDIA4: [],
        SNDIA5: [],
        SNDIA6: [],
        DSCLUSTE: [],
        IDT005: ['', [Validators.required]],
        G005_IDG005: [],
      });

      //# T003 -- FORM CLIENTE ROTA
      this.objFormCliente = formBuilder.group({
        IDT001  : [],
        IDT003  : [],
        IDG024  : [],
        IDG005 : ['', [Validators.required]],
        NRORDCAR : ['', [Validators.required]],
        STCADAST: ['', [Validators.required]],
      });

      //# T002 -- FORM CIDADE ROTA
      this.objFormCidade = formBuilder.group({
        IDT001  : [],
        IDT002  : [],
        IDG024  : [],
        IDG003  : ['', [Validators.required]],
        NRORDCAR: ['', [Validators.required]],
        STCADAST: ['', [Validators.required]],
        SNDIA0: [],
        SNDIA1: [],
        SNDIA2: [],
        SNDIA3: [],
        SNDIA4: [],
        SNDIA5: [],
        SNDIA6: []
      });
    }


    ngOnInit() {
      this.objFormRota.controls['STCADAST'].setValue('A');
      this.objFormRota; //inicia biding com o form
      this.objFormFilter.controls['CALEND'].setValue({id: 0, text: 'Todos'});
      this.mostraDias = true;
      
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
    this.objFormRota.reset()
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
  // FUNÇÕES ROTAS

  addDePara(){
    this.setButsEdit(false);
    this.objFormRota.reset();
    this.objFormRota.controls['STCADAST'].setValue('A');
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addDePara", null, "fa fa-plus");
    this.checkViewDePara = 4;
  }
  viewRotas(id) {
    this.viewGrid = true;
    this.setButsEdit(false);
    this.objFormRota.reset();
    this.exibir = 2;
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewRotas", id, "fa fa-plus");
    var obj = {"IDT001": id};
    this.checkViewDePara = 1;
    this.getRota(obj);
    this.acc.activeIds =  ["1"];

  }

  updateRotas(id) {
    this.viewGrid = false;
    this.setButsEdit(true);
    this.objFormRota.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateRotas", id, "fa fa-plus");
    var obj = {"IDT001": id};
    this.checkViewDePara = 2;
    this.getRota(obj);
    this.acc.activeIds =  ["1"];
  }

  getRota(obj){
    this.idRota = obj.IDT001;
    this.grid.loadGridShow();
    this.rotasService.getRota(obj).subscribe(
      data=>{
        this.objFormRota.controls['IDT001'].setValue(data.IDT001);
        this.objFormRota.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormRota.controls['SNDIA0'].setValue(data.SNDIA0);
        this.objFormRota.controls['SNDIA1'].setValue(data.SNDIA1);
        this.objFormRota.controls['SNDIA2'].setValue(data.SNDIA2);
        this.objFormRota.controls['SNDIA3'].setValue(data.SNDIA3);
        this.objFormRota.controls['SNDIA4'].setValue(data.SNDIA4);
        this.objFormRota.controls['SNDIA5'].setValue(data.SNDIA5);
        this.objFormRota.controls['SNDIA6'].setValue(data.SNDIA6);
        this.objFormRota.controls['DSPRACA'].setValue(data.DSPRACA);
        this.objFormRota.controls['IDT005'].setValue(data.IDT005);
        this.objFormRota.controls['IDG024'].setValue({
         id : data.IDG024,
         text: data.G024_NMTRANSP
        });
        this.objFormRota.controls['IDT005'].setValue({
         id : data.IDT005,
         text: data.T005_DSCLUSTE
        });
        this.idTransp = data.IDG024;
        this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
  }

  saveRota(){

   var result = null,
        copyObjFormRota = null;
        copyObjFormRota = Object.assign({}, this.objFormRota.value);
    
    if (this.validaFormularioValido(this.objFormRota)) {

      var objSaveDePara = this.objFormRota.value;

      //# update
      if (this.objFormRota.controls['IDT001'].value) {
        

        this.rotasService.updateRota(copyObjFormRota).subscribe(
          data => {
              this.objFormRota.reset();
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
        
        this.rotasService.addRota(copyObjFormRota).subscribe(
          data => {
              
              this.objFormRota.reset();
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

  openDeleteRota(id){
    
    this.idRota = id;
    this.nmFunctionDelete = 'deleteRota';
    this.modal.open(this.modalDelete);
  }

  deleteRota(){
    
    this.rotasService.deleteRota(this.idRota).subscribe(
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
  //FUNÇÕES CLIENTES

  openClientes(){
    this.set(3, " Clientes " + this.breadcrumbs.home +" "+ this.idRota, "openClientes", null, "fa fa-map");
    this.exibir = 4;
  }
  addCliente(){
    this.checkSaveCliente = true;
    this.objFormCliente.reset();
    this.objFormCliente.controls['STCADAST'].setValue('A');
    this.objFormCliente.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Novo Cliente", "addCliente", null, "fa fa-plus");
    this.exibir = 5;
  }

  viewCliente(idCliente){
    this.checkSaveCliente = false;
    this.exibir = 5;
    this.objFormCliente.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Visualizar Cliente", "viewCliente", idCliente, "fa fa-eye");
    this.getClientes(idCliente);

  }

  updateCliente(idCliente){
    this.checkSaveCliente = true;
    this.exibir = 5;
    this.objFormCliente.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Editar Cliente", "updateCliente", idCliente, "fa fa-edit");
    this.getClientes(idCliente);

  }
  getClientes(id){
    let obj = {'IDT003': id}
    this.grid.loadGridShow();
    this.rotasService.getClientesRota(obj).subscribe(
      data=>{
        
        this.objFormCliente.reset();
        this.objFormCliente.controls['IDG024'].setValue({
         id : data.IDG024,
         text: data.G024_NMTRANSP
        });
        this.objFormCliente.controls['IDG005'].setValue({
         id : data.IDG005,
         text: data.G005_NMCLIENT
        });
        this.objFormCliente.controls['IDT001'].setValue(this.idRota);
        this.objFormCliente.controls['IDT003'].setValue(data.IDT003);
        this.objFormCliente.controls['NRORDCAR'].setValue(data.NRORDCAR);
        this.objFormCliente.controls['STCADAST'].setValue(data.STCADAST);
        this.grid.loadGridHide();
      }
    );
  }

  saveCliente(){
   var result = null,
        copyObjFormRota = null;
        copyObjFormRota = Object.assign({}, this.objFormCliente.value);
    

    if (this.validaFormularioValido(this.objFormCliente)) {

      var objSaveDePara = this.objFormCliente.value;

      //# update
      if (this.objFormCliente.controls['IDT003'].value) {
        
        copyObjFormRota.IDT001 = parseInt(copyObjFormRota.IDT001);
        copyObjFormRota.IDG024 = {id:this.idTransp};
        this.rotasService.updateCliente(copyObjFormRota).subscribe(
          data => {
              this.objFormCliente.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 4;
              this.breadcrumbs.goBack();
              this.find('clientesRota');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      //# save
      } else {
        
        copyObjFormRota.IDG024 = {id:this.idTransp};
        this.rotasService.addCliente(copyObjFormRota).subscribe(
          data => {
              this.objFormCliente.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 4;
              this.breadcrumbs.goBack();
              this.find('clientesRota');
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
  openDeleteCliente(id){
    this.idCliente = id;
    this.nmFunctionDelete = 'deleteCliente';
    this.modal.open(this.modalDelete);
  }

  deleteCliente(){
    this.rotasService.deleteCliente(this.idCliente).subscribe(
      data => {
        this.find('clientesRota');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
       }
    );
  }


  //###############################
  // FUNÇÕES CIDADES
  openCidades(){
    this.exibir = 3;
    this.set(3, " Cidades " + this.breadcrumbs.home +" "+ this.idRota, "openCidades", null, "fa fa-map");
  }

  openSaveCidades(){
    this.saveRota();
    this.openCidades();
  }

  addCidade(){
    this.checkSaveCidade = true;
    this.objFormCidade.reset();
    this.objFormCidade.controls['STCADAST'].setValue('A');
    this.objFormCidade.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Nova Cidade", "addCidade", null, "fa fa-plus");
    this.exibir = 6;
  }

  viewCidade(idCidade){
    this.checkSaveCidade = false;
    this.exibir = 6;
    this.objFormCidade.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Visualizar Cidade", "viewCidade", idCidade, "fa fa-eye");
    this.getCidades(idCidade);

  }

  updateCidade(idCidade){
    this.checkSaveCidade = true;
    this.exibir = 6;
    this.objFormCidade.controls['IDT001'].setValue(this.idRota);
    this.set(4, "Editar Cidade", "updateCidade", idCidade, "fa fa-edit");
    this.getCidades(idCidade);

  }
  getCidades(id){
    let obj = {'IDT002': id}
    this.grid.loadGridShow();
    this.rotasService.getCidadeRota(obj).subscribe(
      data=>{
        
        this.objFormCidade.reset();
        this.objFormCidade.controls['IDG024'].setValue({
         id : data.IDG024,
         text: data.G024_NMTRANSP
        });
        this.objFormCidade.controls['IDG003'].setValue({
         id : data.IDG003,
         text: data.G003_NMCIDADE
        });
        this.objFormCidade.controls['IDT001'].setValue(this.idRota);
        this.objFormCidade.controls['IDT002'].setValue(data.IDT002);
        this.objFormCidade.controls['NRORDCAR'].setValue(data.NRORDCAR);
        this.objFormCidade.controls['STCADAST'].setValue(data.STCADAST);
        this.objFormCidade.controls['SNDIA0'].setValue(data.SNDIA0);
        this.objFormCidade.controls['SNDIA1'].setValue(data.SNDIA1);
        this.objFormCidade.controls['SNDIA2'].setValue(data.SNDIA2);
        this.objFormCidade.controls['SNDIA3'].setValue(data.SNDIA3);
        this.objFormCidade.controls['SNDIA4'].setValue(data.SNDIA4);
        this.objFormCidade.controls['SNDIA5'].setValue(data.SNDIA5);
        this.objFormCidade.controls['SNDIA6'].setValue(data.SNDIA6);
        this.grid.loadGridHide();
      }
    );
  }

  saveCidade(){
   var result = null,
        copyObjFormRota = null;
        copyObjFormRota = Object.assign({}, this.objFormCidade.value);
    

    if (this.validaFormularioValido(this.objFormCidade)) {

      var objSaveDePara = this.objFormCidade.value;

      //# update
      if (this.objFormCidade.controls['IDT002'].value) {
        
        copyObjFormRota.IDT001 = parseInt(copyObjFormRota.IDT001);
        copyObjFormRota.IDG024 = {id:this.idTransp};
        this.rotasService.updateCidade(copyObjFormRota).subscribe(
          data => {
              this.objFormCidade.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('cidades');
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
          }
        );

      //# save
      } else {
        
        copyObjFormRota.IDG024 = {id:this.idTransp};
        this.rotasService.addCidade(copyObjFormRota).subscribe(
          data => {
              this.objFormCidade.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 3;
              this.breadcrumbs.goBack();
              this.find('cidades');
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
  openDeleteCidade(id){
    this.idCidade = id;
    this.nmFunctionDelete = 'deleteCidade';
    this.modal.open(this.modalDelete);
  }

  deleteCidade(){
    this.rotasService.deleteCidade(this.idCidade).subscribe(
      data => {
        this.find('cidades');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
       }
    );
  }

  validaCalend(){
    if(this.objFormFilter.controls['CALEND'].value.id == 2){
      this.mostraDias = false;
      this.objFormFilter.controls['SNDIA0_filter'].reset();
      this.objFormFilter.controls['SNDIA1_filter'].reset();
      this.objFormFilter.controls['SNDIA2_filter'].reset();
      this.objFormFilter.controls['SNDIA3_filter'].reset();
      this.objFormFilter.controls['SNDIA4_filter'].reset();
      this.objFormFilter.controls['SNDIA5_filter'].reset();
      this.objFormFilter.controls['SNDIA6_filter'].reset();
    }else{
      this.mostraDias = true;
    }
  }

  //###############################


  close(){
    this.modal.closeModal();
  }



  //##############################



  //##############################
  //# DataGRID
  find(id){
    this.grid.findDataTable(id);
  }
  limpar(){
    this.objFormFilter.reset();
    this.objFormFilter.controls['CALEND'].setValue({id: 0, text: 'Todos'});
    this.mostraDias = true;
    this.grid.findDataTable('rotas');
  }
  filtrar(){

    


    let objfilterAux = Object.assign({}, this.objFormFilter.value);
    //Rotas
    var arrayIds = []
    for(let objRotas of objfilterAux.IDT001){
     arrayIds.push(objRotas.id);
    }
    objfilterAux.IDT001  = {in: arrayIds}
    this.objfilter.value = objfilterAux;

    //Clientes
    var arrayIds = []
    for(let objClientes of objfilterAux.T003_IDG005){
      arrayIds.push(objClientes.id);
     }
     objfilterAux.T003_IDG005  = {in: arrayIds}
     this.objfilter.value = objfilterAux;

     
    this.grid.findDataTable('rotas','objfilter');
    

  }
  //##############################


  setButsEdit(way){
    this.butsEdit = way;
    if(this.butsEdit == true){
      this.acoesTelaCit = [        
                            {'id' : 1, 'metodo' : 'viewCidade',   'icone': 'fa fa-eye'},
                            {'id' : 2, 'metodo' : 'updateCidade',   'icone': 'fas fa-pencil-alt'},
                            {'id' : 3, 'metodo' : 'openDeleteCidade', 'icone': 'fas fa-trash-alt'}
                          ];
      this.globalTelaCit = [
                        {'id' : 3, 'metodo' : 'deleteCidade',  'icone':'fa fa-minus'},
                        {'id' : 4, 'metodo' : 'addCidade', 'icone':'fa fa-plus'},
                        {'id' : 'excel'},
                        {'id' : 'colvis'}
                      ];
      this.globalTelaCli=[  
                            {'id' : 3, 'metodo' : 'deleteCliente',  'icone':'fa fa-minus'},
                            {'id' : 4, 'metodo' : 'addCliente', 'icone':'fa fa-plus'},
                            {'id' : 'excel'},
                            {'id' : 'colvis'} 
                          ];
      this.acoesTelaCli=[
                          {'id' : 1, 'metodo' : 'viewCliente',   'icone': 'fa fa-eye'},
                          {'id' : 2, 'metodo' : 'updateCliente',   'icone': 'fas fa-pencil-alt'},
                          {'id' : 3, 'metodo' : 'openDeleteCliente', 'icone': 'fas fa-trash-alt'}
                        ];
    }else{
      this.acoesTelaCit = [{'id' : 1, 'metodo' : 'viewCidade',   'icone': 'fa fa-eye'}];
      this.globalTelaCit = [{'id' : 'excel'},{'id' : 'colvis'}];
      this.acoesTelaCli = [{'id' : 1, 'metodo' : 'viewCidade',   'icone': 'fa fa-eye'}];
      this.globalTelaCli = [{'id' : 'excel'},{'id' : 'colvis'}];    
    }

      
  }
    
  


}
