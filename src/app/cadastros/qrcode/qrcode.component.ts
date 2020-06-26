import { QrcodeService } from './../../services/crud/qrcode.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalSimularRota') modalSimularRota: any;
  @ViewChild('modalAltera') modalAltera: any;


  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "qrcode";
  urlQrcodeGrid       = this.apiUrl+'tp/qrcode/listar'
  checkViewQrcode     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idQrcode            = null;
  time                = '';
  idMobile            = null;



  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  objFormAlterar: FormGroup;

  //# modal
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private qrcodeService: QrcodeService,
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

        STQRCODE: [''],
        IDM001  : [''],
        IDG031  : ['']

      });


      this.objFormAlterar = formBuilder.group({
        IDG031  : [''],
        IDM001  : ['']
      });


      this.objFormConfiguracao = formBuilder.group({

        IDM001:   [],
        DSMOBILE: ['', Validators.required],
        NRFONE:   ['', Validators.required],
        DSMACADD: ['', Validators.required],
        DSHASHQR: [''],
        STQRCODE: ['C', Validators.required],
        IDG031:   ['', Validators.required]


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



  //# Modal Delte Qrcode
  //##############################

  addQrcode(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addQrcode", null, "fa fa-plus");
    this.checkViewQrcode = 4;
    //this.objFormConfiguracao.controls['STCADAST'].setValue('C');
     this.objFormConfiguracao.controls['STQRCODE'].setValue('C');
  }

  viewQrcode(id) {

    id = JSON.parse(id);

    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewQrcode", null, "fa fa-plus");
    var obj = id; //{"IDM001": id};
    this.checkViewQrcode = 1;
    this.getQrcode(obj);
  }

  updateQrcode(id) {

    id = JSON.parse(id);

    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updateQrcode", null, "fa fa-plus");
    var obj = id; //{"IDM001": id};
    this.checkViewQrcode = 2;
    this.getQrcode(obj);
  }


  getQrcode(obj){
    this.grid.loadGridShow();
    this.qrcodeService.getQrcode(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDM001'].setValue(data.IDM001);
        this.objFormConfiguracao.controls['DSMOBILE'].setValue(data.DSMOBILE);
        this.objFormConfiguracao.controls['NRFONE'].setValue(data.NRFONE);
        this.objFormConfiguracao.controls['DSMACADD'].setValue(data.DSMACADD);
        this.objFormConfiguracao.controls['DSHASHQR'].setValue(data.DSHASHQR);
        this.objFormConfiguracao.controls['STQRCODE'].setValue(data.STQRCODE);
        this.objFormConfiguracao.controls['IDG031'].setValue(data.IDG031);
        this.exibir = 2;
        this.grid.loadGridHide();
      }
    );
    this.grid.loadGridHide();
    // this.set(1,"Detalhes Qrcode", "getQrcode", obj.IDM001, "fa fa-map");
  }



  saveQrcode(){

   var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        

    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSaveQrcode = this.objFormConfiguracao.value;

      //# update
      if (this.objFormConfiguracao.controls['IDM001'].value) {

        this.qrcodeService.updateQrcode(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
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

        this.qrcodeService.addQrcode(slotsValue).subscribe(
          data => {
              this.objFormConfiguracao.reset();
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

  //##############################



  openDelete(id){
    console.log('1', id);

    id = JSON.parse(id);

    this.idQrcode = id.IDM001;
    this.modal.open(this.modalDelete);
  }

  deleteQrcode(ids){
    console.log('2', ids);
    this.idQrcode = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }


  confirmaDeleteQrcode(){

    this.grid.loadGridShow();
    this.qrcodeService.deleteQrcode(this.idQrcode).subscribe(
      data => {
        this.find(this.idDataGrid);
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
        this.grid.loadGridHide();
      },
      err => {
        this.grid.loadGridHide();
        this.mensagens.mensagemErroPadrao(err);
       }
    );
  }
  //##############################


  gerarQrcode(obj){
    obj = JSON.parse(obj);
    console.log(obj);
    this.time = obj.DSHASHQR;

    this.grid.loadGridShow();
    if(obj.STQRCODE == 'C'){
      this.modal.open(this.modalSimularRota, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
    }else{
      this.toastr.warning("MacAddress possui vínculo", obj.DSMACADD);
    }
    this.grid.loadGridHide();

  }




  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){
    this.grid.findDataTable(this.idDataGrid);
    
  }
  //##############################



  openAlterar(obj){
    obj = JSON.parse(obj);
    this.idMobile = obj.IDM001;
    this.modal.open(this.modalAltera);
  }

  confirmaAlterar(){
    if(this.validaFormularioValido(this.objFormAlterar)){
      this.grid.loadGridShow();
      this.objFormAlterar.controls['IDM001'].setValue(this.idMobile);
      this.qrcodeService.atualizarMotorista(this.objFormAlterar.value).subscribe(
        data=>{
          this.toastr.success("Motorista atualizado com sucesso");
          this.find(this.idDataGrid);
          this.modal.closeModal();
          this.grid.loadGridHide();
        },
        err=>{
          this.grid.loadGridHide();
        }
      );
    }else{
      this.toastr.warning("Campos obrigatórios não preenchidos!");
    }
  }


}
