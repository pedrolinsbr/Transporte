import { LancamentoCampanhaService } from './../../../services/crud/lancamento-campanha.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-lancamento-campanha-massa',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lancamento-campanha-massa.component.html',
  styleUrls: ['./lancamento-campanha-massa.component.scss']
})
export class LancamentoCampanhaMassaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalLancamento') private modalLancamento;
  @ViewChild('modalConfirmaExclusao') private modalConfirmaExclusao;
  @ViewChild('modalConfirmaFechamento') private modalConfirmaFechamento;
  @ViewChild('modalVisualizarFechamento') private modalVisualizarFechamento;
  
  uploadResult: any = [];
  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "lancamentoCampanha";
  urlLancamentoCampanhaGrid       = this.apiUrl+'tp/lancamentoCampanha/listar'
  checkViewLancamentoCampanha     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idLancamentoCampanha            = null;
  disabledViewMultiSelect = true;
  token = localStorage.getItem('token');
  loadingModal = false;
  btFechar = false;
  stLancam = false;

  idG093 = 0;
  idA004 : any = {};
  UserId = localStorage.getItem('ID_USER');
  idg097Aux = 0;

  arListaMotorista    = [];
  arListaApontamentos = [];
  arListaApontaUser   = [];
  arListaApontaUserAUX = [];
  arListaFechamento    = [];

  arListaApontaUserRetifica   = [];
  arListaApontaUserAUXRetifica = [];

  arListaApontaUserAcl   = [];
  arListaApontaUserAUXAcl = [];

  arListaSnLancando   = [];
  arListaLancamento   = [];
  arListaAnexoLancamento   = [];
  arListaObservacao  = [];

  arUpload:any = [];
  objFormClose = {value:null};

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  objFormObservacao:   FormGroup;
  objFormModel   : FormGroup;
  objFormAcoes   : FormGroup;
  modalRef: NgbModalRef;
  uploaderA: FileUploader;


  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


	uploader: FileUploader = new FileUploader({
		url: this.apiUrl + 'tp/lancamentoCampanha/file?token='+this.token,
		method: 'put', 
		additionalParameter: 
		{
			NMTABELA: 'A004',
      IDS001: localStorage.getItem('ID_USER'),
      IDG093: 0}
	});


    constructor(
      private mensagens : MensagensComponent,
      private lancamentoCampanhaService: LancamentoCampanhaService,
      private formBuilder: FormBuilder,
      private toastr: ToastrService,
      public utilServices: UtilServices,
      private modal : ModalComponent,
      private grid : DatagridComponent,
      public  translate: TranslateService,
      private modalService: NgbModal,
      public  vRef: ViewContainerRef

    )
    {

      const browserLang: string = translate.getBrowserLang();
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDG090: [''],
        CDMES:['', Validators.required],
        IDG031: [[]],
        STLANCAM:['']
      });

      this.objFormAcoes = formBuilder.group({
        IDS001: [''],
        IDS022:['', Validators.required],
        idAcoes: [],
        DSVALUE:[],
      })

      this.objFormConfiguracao = formBuilder.group({

          IDG093: [],
          IDG090: ['', Validators.required],
          IDG092: ['', Validators.required],
          IDG031: ['', Validators.required],
          IDG091: [[], Validators.required],
          IDG024: ['', Validators.required],
          VRPONTUA: ['', Validators.required],
          DTAPONTA: ['', Validators.required],
          DSOBSERV: ['', Validators.required],

      });

      this.objFormObservacao = formBuilder.group({

          DSOBSERV: [],

      });





     //  this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
     //    //form.append('PKS007', this.objRastreio.IDG043);
     //    this.loadingModal = true;
     // }
 
     // this.uploader.onSuccessItem = (item, response, status, headers) => {
     //   this.uploadResult = {
     //     "success": true, "item": item, "response":
     //     response, "status": status, "headers": headers
     //   };
     // };

     //  this.uploader.onErrorItem = (item, response, status, headers) => {
     //   this.uploadResult = {
     //     "success": false, "item": item,
     //     "response": response, "status": status, "headers": headers
     //   };
     //  };

       // this.uploader.onCompleteAll = () => {
       //   this.handleUploadComplete();
       // };

    }



    ngOnInit() {
      this.objFormConfiguracao; //inicia biding com o form

      this.utilServices.loadGridShow();
      
      //# todos os apontamentos
      this.lancamentoCampanhaService.getApontamentoExistentes().subscribe(
        data=>{
          this.arListaApontamentos = data;
          //this.utilServices.loadGridHide();
          console.log('all',data);
        }
      );
      
      //# Apotamentos do usuario
      this.lancamentoCampanhaService.getApontamentoExistentesUser().subscribe(
        data=>{
          this.arListaApontaUser = data;
          this.arListaApontaUserAUX = data;
          console.log('user',data);
        }
      );

      //# Retificação
      this.lancamentoCampanhaService.getApontamentoExistentesUserRetifica().subscribe(
        data=>{
          this.arListaApontaUserRetifica = data;
          this.arListaApontaUserAUXRetifica = data;
          console.log('reti',data);
        }
      );
      
      //# Acl
      this.lancamentoCampanhaService.getApontamentoExistentesUserAcl().subscribe(
        data=>{
          this.arListaApontaUserAcl = data;
          this.arListaApontaUserAUXAcl = data;
          console.log('acl',data);
        }
      );


      this.objFormAcoes.value['IDS001']  = localStorage.getItem('ID_USER');
      this.objFormAcoes.value['IDS022']  = 377;//Menu Segurança Premiada
      this.objFormAcoes.value['idAcoes'] = [91];//Ação Fechar Lançamentos

      this.lancamentoCampanhaService.buscarAcoes(this.objFormAcoes.value).subscribe(
        data=>{
          if(data[0] != undefined && data[0].IDS023 == 91){
            this.btFechar = true;
          }
          this.utilServices.loadGridHide();
        }
      );

    }

    handleUploadComplete(IDG093) {
	    let arObj = [];
	    //console.log(this.arUpload[IDG093].queue)
	    for(let item of this.arUpload[IDG093].queue){
	      if(!item.isSuccess){
	        arObj.push(item);
	      }
	    }
	    this.arUpload[IDG093].queue = arObj;
	    if (this.uploadResult[IDG093].success) {
				//this.loadingModal = false;
				this.toastr.success('Arquivo(s) importado(s) com sucesso.');
				//this.getInfoCanhoto(this.objRastreio.IDG043, true);
	      //this.router.navigate(['cte/importar']);
	      // this.accordionIndex = '1';

        this.getAnexoLancamento(IDG093);

	    } else {
				this.loadingModal = false;
				console.log(this.uploadResult[IDG093]);
	      this.toastr.error(this.uploadResult[IDG093][IDG093].response);
		  }

      this.utilServices.loadGridHide();
		
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

  addLancamentoCampanha(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addLancamentoCampanha", null, "fa fa-plus");
    this.checkViewLancamentoCampanha = 4;
  }

  viewLancamentoCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewLancamentoCampanha", null, "fa fa-plus");
    var obj = {"IDG093": id};
    this.checkViewLancamentoCampanha = 1;
    this.getLancamentoCampanha(obj);
  }

  updateLancamentoCampanha(id) {
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateLancamentoCampanha", null, "fa fa-plus");
    var obj = {"IDG093": id};
    this.checkViewLancamentoCampanha = 2;
    this.getLancamentoCampanha(obj);
  }


  getLancamentoCampanha(obj){
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.getLancamentoCampanha(obj).subscribe(
      data=>{


        var dtPontua = null;
        dtPontua = new Date(data.DTAPONTA);
        dtPontua = {date:{year: dtPontua.getFullYear(), month: dtPontua.getMonth()+1 , day: dtPontua.getDate()}};


        this.objFormConfiguracao.controls['IDG093'].setValue(data.IDG093);

        this.objFormConfiguracao.controls['IDG090'].setValue({id:data.IDG090, text:data.DSCAMPAN});
        this.objFormConfiguracao.controls['IDG092'].setValue({id:data.IDG092, text:data.TPAPONTA});
        this.objFormConfiguracao.controls['IDG031'].setValue({id:data.IDG031, text:data.NMMOTORI});
        this.objFormConfiguracao.controls['IDG091'].setValue(data.IDG091);
        this.objFormConfiguracao.controls['IDG024'].setValue({id:data.IDG024, text:data.NMTRANSP});
        this.objFormConfiguracao.controls['VRPONTUA'].setValue(data.VRPONTUA);
        this.objFormConfiguracao.controls['DTAPONTA'].setValue(dtPontua);
        this.objFormConfiguracao.controls['DSOBSERV'].setValue(data.DSOBSERV);
        this.exibir = 2;
        this.utilServices.loadGridHide();
        console.log('aaa', this.objFormConfiguracao);
      }
    );
    this.set(1,"Detalhes LancamentoCampanha", "getLancamentoCampanha", obj.IDG093, "fa fa-map");
  }


  saveLancamentoCampanha(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveLancamentoCampanha = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG093'].value) {

        this.lancamentoCampanhaService.updateLancamentoCampanha(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
            this.utilServices.loadGridHide();
          }
        );
      } else {
        this.lancamentoCampanhaService.addLancamentoCampanha(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
              this.mensagens.MensagemSucesso(data.response, '');
              this.exibir = 1;
              this.goHome(event);
              this.find(this.idDataGrid);
              this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.mensagemErroPadrao(err);
            this.utilServices.loadGridHide();

          }
        );
      }
    } else {
      var res = null;
      res = this.translate.get('it.erro.formIncompleto');
      this.toastr.error(res.value);
    }

  }

  openDelete(id){
    this.idLancamentoCampanha = id;
    this.modal.open(this.modalDelete);
  }

  deleteLancamentoCampanha(ids){
    this.idLancamentoCampanha = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeleteLancamentoCampanha(){
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.deleteLancamentoCampanha(this.idLancamentoCampanha).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );
  }

  find(id){
    this.grid.findDataTable(id);
  }
  

  filtrar(){

    if (this.objFormFilter.valid) {

      var obj = null,
      obj = Object.assign({}, this.objFormFilter.value);

      this.utilServices.loadGridShow();
      this.lancamentoCampanhaService.getListarMotoristas(obj).subscribe(
        data=>{
          this.arListaMotorista = data;
          this.utilServices.loadGridHide();
          console.log(data);
          
          if(this.arListaMotorista.length > 0 && this.arListaMotorista[0].SNLANCAM >= 1){
            //# Retificação
            this.arListaApontaUser = this.arListaApontaUserAUXRetifica;

            //this.arListaApontaUser = [];
            this.stLancam = true;

          }else{
            this.arListaApontaUser = this.arListaApontaUserAUX;
            this.stLancam = false;
          }
        }
      );

    } else {
      this.toastr.error('Por favor, preencha os campos obrigatórios!');
      return false;
    }

  }

  setTipoVeiculo(event) {
    //console.log('aaaa', event);
    //this.objFormCarga.controls['IDG030'].setValue({ id: event.idg030, text: event.dstipvei, qtcappes: event.qtcappes });
    this.objFormConfiguracao.controls['VRPONTUA'].setValue(event.vrpontua);
  }


  setTransportadorasParticipantes(event) {
    console.log('aaaa', event);
    //this.objFormCarga.controls['IDG030'].setValue({ id: event.idg030, text: event.dstipvei, qtcappes: event.qtcappes });
    //this.objFormConfiguracao.controls['VRPONTUA'].setValue(event.vrpontua);
    if(event != null && event.id != undefined && event.id != null){

      this.utilServices.loadGridShow();
      this.lancamentoCampanhaService.getTransportadorasParticipantes({IDG090:event.id}).subscribe(
        data => {
          this.objFormConfiguracao.controls['IDG091'].setValue(data);
          this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
          this.utilServices.loadGridHide();
         }
      );

    }else{
      this.objFormConfiguracao.controls['IDG091'].setValue(null);
    }
  }


  atualizarLancamento(TPOPERAC,IDG099,IDG092, IDG090, IDG024, STLANCAM){
    

      var obj = {TPOPERAC:TPOPERAC, IDG099:IDG099, IDG092:IDG092, IDG090:IDG090, IDG024:IDG024, CDMES:this.objFormFilter.controls['CDMES'].value, STLANCAM:STLANCAM};

      this.utilServices.loadGridShow();
      this.lancamentoCampanhaService.setLancamento(obj).subscribe(
        data => {

          if($('#vr_aponta_'+IDG099+'_'+IDG092).val() != data){
            this.toastr.success('Lançamento atualizado');
          }else{
            this.toastr.info('Não houve mudanças no lançamento ');
          }

          $('#vr_aponta_'+IDG099+'_'+IDG092).val(data);
          this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
          this.utilServices.loadGridHide();
         }
      );

  }



  editarLancamentoKm(IDG092,IDG099){
    this.arListaSnLancando['km_'+IDG099+'_'+IDG092] = 1;
    $('#vr_km_'+IDG099+'_'+IDG092).prop("disabled", false);
  }

  limparLancamentoKm(IDG092,IDG099){
    this.arListaSnLancando['km_'+IDG099+'_'+IDG092] = 0;
    $('#vr_km_'+IDG099+'_'+IDG092).prop("disabled", true);
  }


  editarLancamentoMd(IDG092,IDG099){
    this.arListaSnLancando['md_'+IDG099+'_'+IDG092] = 1;
    $('#id_md_'+IDG099+'_'+IDG092).prop("disabled", false);
  }

  limparLancamentoMd(IDG092,IDG099){
    this.arListaSnLancando['md_'+IDG099+'_'+IDG092] = 0;
    $('#id_md_'+IDG099+'_'+IDG092).prop("disabled", true);
  }


  atualizarLancamentoKm(TPOPERAC,IDG099,IDG092, IDG090, IDG024, STLANCAM){

    var VRKM = $('#vr_km_'+IDG099+'_'+IDG092).val();
    var obj = {TPOPERAC:TPOPERAC, IDG099:IDG099, IDG092:IDG092, IDG090:IDG090, IDG024:IDG024, VRKM:VRKM, CDMES:this.objFormFilter.controls['CDMES'].value, STLANCAM:STLANCAM};

    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.setLancamentoKm(obj).subscribe(
      data => {
        this.arListaSnLancando['km_'+IDG099+'_'+IDG092] = 0;
        $('#vr_km_'+IDG099+'_'+IDG092).prop("disabled", true);

        $('#vr_km_'+IDG099+'_'+IDG092).val(data.VRKM);
        $('#pt_km_'+IDG099+'_'+IDG092).val(data.PTKM);
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );

  }



  removerLancamento(IDG093,STLANCAM){

    let obj = {IDG093:IDG093, CDMES:this.objFormFilter.controls['CDMES'].value, STLANCAM:STLANCAM};

    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.removerLancamento(obj).subscribe(
      data => {

        this.arListaLancamento = data;

        for (var i = data.length - 1; i >= 0; i--) {
          this.arListaAnexoLancamento[data[i].IDG093] = [];
          this.getAnexoLancamento(data[i].IDG093);
          this.cria(data[i].IDG093);
        }
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );

  }





  atualizarLancamentoMd(TPOPERAC,IDG099,IDG092, IDG090, IDG024, STLANCAM){

    var IDSELECT = $('#id_md_'+IDG099+'_'+19).val();
    console.log(IDSELECT);
    if(IDSELECT != 0){
      var obj = {TPOPERAC:TPOPERAC, IDG099:IDG099, IDG092:IDG092, IDG090:IDG090, IDG024:IDG024, IDSELECT:IDSELECT, CDMES:this.objFormFilter.controls['CDMES'].value, STLANCAM:STLANCAM};

      this.utilServices.loadGridShow();
      this.lancamentoCampanhaService.setLancamentoMd(obj).subscribe(
        data => {
          this.arListaSnLancando['md_'+IDG099+'_'+19] = 0;
          $('#id_md_'+IDG099+'_'+19).prop("disabled", true);
          $('#id_md_'+IDG099+'_'+19).val(data.IDG092);
          this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
          this.utilServices.loadGridHide();
        }
      );
    }else{
      this.toastr.warning("Não é possível atribuir valor vazio!");
    }

  }




  openVisualizacaoLancamento(IDG099, IDG092, IDG090){
    //this.idLancamentoCampanha = id;
    let obj = {IDG099:IDG099, IDG090:IDG090, IDG092:IDG092, CDMES:this.objFormFilter.controls['CDMES'].value}

    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.getListaLancamento(obj).subscribe(
      data=>{
        this.arListaLancamento = data;
        //console.log('aaaaa',data);
        for (var i = data.length - 1; i >= 0; i--) {
          this.arListaAnexoLancamento[data[i].IDG093] = [];
          this.getAnexoLancamento(data[i].IDG093);
          this.cria(data[i].IDG093);
        }
        this.utilServices.loadGridHide();
        
        if(data.length >= 1){
          this.modal.open(this.modalLancamento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
        }else{
          this.toastr.warning("Motorista não possui lançamento!");
        }
      }
    );
  }

 cria(IDG093){

  this.buscaObservacao(IDG093);

  //// this['objFormObservacao'+IDG093] = this.objFormModel;
  //// this['objFormObservacao'+IDG093] = this.formBuilder.group({
  //     DSOBSERV: [],
  // });

  this.arUpload[IDG093] = new FileUploader({
    url: this.apiUrl + 'tp/lancamentoCampanha/file?token='+this.token,
    method: 'put', 
    additionalParameter: 
    {
      NMTABELA: 'A004',
      IDS001: localStorage.getItem('ID_USER'),
      IDG093: 0}
  });


   this.arUpload[IDG093].onCompleteAll = () => {
     this.handleUploadComplete(IDG093);
   };



  // this.arUpload[IDG093].onBuildItemForm = (fileItem: any, form: any) => {
  //   //form.append('PKS007', this.objRastreio.IDG043);
  //   this.loadingModal = true;
  // }

  this.arUpload[IDG093].onSuccessItem = (item, response, status, headers) => {
   this.uploadResult[IDG093] = {
     "success": true, "item": item, "response":
     response, "status": status, "headers": headers
   };
  };

  this.arUpload[IDG093].onErrorItem = (item, response, status, headers) => {
   this.uploadResult[IDG093] = {
     "success": false, "item": item,
     "response": response, "status": status, "headers": headers
   };
  };



 }


  getAnexoLancamento(IDG093){
    
    let obj = {IDG093:IDG093}
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.getAnexoLancamento(obj).subscribe(
      data=>{
        this.arListaAnexoLancamento[IDG093] = data;
        console.log(data);
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );
  }


  buscaObservacao(IDG093){
    
    let obj = {IDG093:IDG093}
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.buscaObservacao(obj).subscribe(
      data=>{
        //this['objFormObservacao'+IDG093].controls['DSOBSERV'].setValue(data.DSOBSERV);
        $('#textarea_'+IDG093).val(data.DSOBSERV)
        this.arListaObservacao[IDG093] = 0;

        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );
  }




  editarObservacao(IDG093){
     this.arListaObservacao[IDG093] = 1;
    $('#textarea_'+IDG093).prop("disabled", false);
  }

  limparObservacao(IDG093){
     this.arListaObservacao[IDG093] = 0;
    $('#textarea_'+IDG093).prop("disabled", true);
  }


  atualizarObservacao(IDG093){

    var DSOBSERV = $('#textarea_'+IDG093).val();
    var obj = {IDG093:IDG093, DSOBSERV:DSOBSERV};

    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.atualizaObservacao(obj).subscribe(
      data => {
        this.limparObservacao(IDG093);
        this.utilServices.loadGridHide();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );

  }





  
	envioUpload(id){
    this.idG093 = id;
    this.arUpload[id].options.additionalParameter.IDG093 = id;
    console.log('aaaa', this.arUpload[id], this.arUpload[id].options.additionalParameter);
		this.utilServices.loadGridShow();
    this.arUpload[id].uploadAll();
	}


  openModalConfirmacao(id) : void {
    this.idA004 = id;
    this.modal.open(this.modalConfirmaExclusao,{ size: 'lg', windowClass: 'modal-adaptive' });
  }


  removeAnexoLancamento(){
    
    let obj = {IDA004:this.idA004.IDA004}
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.excluirAnexoLancamento(obj).subscribe(
      data=>{
        this.mensagens.MensagemSucesso(data.response, '');
        console.log(data);
        this.utilServices.loadGridHide();
        this.getAnexoLancamento(this.idA004.IDG093);
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
       }
    );
  }


  downloadAnexoLancamento(obj){
    this.utilServices.loadGridShow();
    this.lancamentoCampanhaService.downloadAnexoLancamento(obj).subscribe(
      data => {

        console.log('receipt data');
        console.log(data);
        
        let url = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'Arquivo';
        link.dispatchEvent(new MouseEvent('click'));
        this.utilServices.loadGridHide();
      }, err => {
        this.toastr.error('Não foi possível realizar a operação');
        this.utilServices.loadGridHide();
      }
    )
  }

  openModalVisualizarFechamento(){

    console.log('openModalVisualizarFechamento');

    if(this.objFormFilter.value['CDMES'] == null){

      this.mensagens.MensagemErro('Por favor, preencha o campo "Mês", no qual, gostaria de fechar os lançamentos.','');

    }
    // else if(this.objFormFilter.value['IDG090'] == null ){

    //   this.mensagens.MensagemErro('Por favor, preencha o campo "Campanha", no qual, gostaria de fechar os lançamentos.','');

    // }
    else{

      this.utilServices.loadGridShow();
      this.arListaFechamento = [];

      console.log('================');
      this.objFormFilter.value['STLANCAM'] = this.stLancam;
      console.log(this.objFormFilter.value);

      this.lancamentoCampanhaService.getUsuariosFechamento(this.objFormFilter.value).subscribe(
        data=>{

          
          this.arListaFechamento = data;
          console.log(this.arListaFechamento);
          this.modal.open(this.modalVisualizarFechamento,{ size: 'xl', windowClass: 'modal-adaptive' });
          this.utilServices.loadGridHide();
        },
        err => {
          this.modal.closeModal();
          this.mensagens.mensagemErroPadrao(err);
          this.utilServices.loadGridHide();
        }
      );
      
    }
  }

  fecharLancamentos(i){

    this.utilServices.loadGridShow();

    console.log(this.arListaFechamento[i]);

    this.objFormClose.value = this.arListaFechamento[i];
    this.objFormClose.value['CDMES']  = this.objFormFilter.value['CDMES'];
    this.objFormClose.value['USERID'] = this.UserId;

    this.lancamentoCampanhaService.validaFechamento(this.objFormClose.value).subscribe(
      data=>{
        this.mensagens.MensagemSucesso(data.response, '');
        this.modal.closeModal();
        //this.utilServices.loadGridHide();
        console.log(data);
        this.filtrar();
        
      },
      err => {
        this.modal.closeModal();
        this.mensagens.mensagemErroPadrao(err);
        this.utilServices.loadGridHide();
      }
    );
  }

}
