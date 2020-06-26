import { PermissoesFechamentoService } from './../../../services/crud/permissoes-fechamento.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-permissoes-fechamento',
  templateUrl: './permissoes-fechamento.component.html',
  styleUrls: ['./permissoes-fechamento.component.scss']
})
export class PermissoesFechamentoComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "permissoesFechamento";
  urlPermissoesFechamentoGrid       = this.apiUrl+'tp/permissoesFechamento/listar'
  checkViewPermissoesFechamento     = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;
  idPermissoesFechamento            = null;
  selectedTipoAponta;
  tipoAponta = [{ id: 46, name: "1 - Geral" }, { id: 47, name: "2 - KM e Média" }, { id: 48, name: "3 - Multas e Sugestões" }];

  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;
  modalRef: NgbModalRef;

    constructor(
      private mensagens : MensagensComponent,
      private permissoesFechamentoService: PermissoesFechamentoService,
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
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({
        IDG103: []

      });

      this.objFormConfiguracao = formBuilder.group({

        IDG103: [],
        IDS001: ['', Validators.required],
        IDG090: ['', Validators.required],
        IDG024: ['', Validators.required],
        IDG097: ['', Validators.required],
        IDS001PA: ['', Validators.required],

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

  addPermissoesFechamento(){
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.novo') + " " + this.breadcrumbs.home, "addPermissoesFechamento", null, "fa fa-plus");
    this.checkViewPermissoesFechamento = 4;
  }

  viewPermissoesFechamento(id) {

    var obj = JSON.parse(id);
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewPermissoesFechamento", null, "fa fa-plus");
    this.checkViewPermissoesFechamento = 1;
    this.getPermissoesFechamento({"IDG103": obj.IDG103});
  }

  updatePermissoesFechamento(id) {
    var obj = JSON.parse(id);
    this.objFormConfiguracao.reset();
    this.exibir = 2
    this.set(1,this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "updatePermissoesFechamento", null, "fa fa-plus");
    this.checkViewPermissoesFechamento = 2;
    this.getPermissoesFechamento({"IDG103": obj.IDG103});
  }


  getPermissoesFechamento(obj){
    this.utilServices.loadGridShow();
    this.permissoesFechamentoService.getPermissoesFechamento(obj).subscribe(
      data=>{

        this.objFormConfiguracao.controls['IDG103'].setValue(data.IDG103);
        this.objFormConfiguracao.controls['IDS001'].setValue({id:data.IDS001, text:data.NMUSUARI});
        this.objFormConfiguracao.controls['IDG090'].setValue({id:data.IDG090, text:data.DSCAMPAN});
        this.objFormConfiguracao.controls['IDG024'].setValue({id:data.IDG024, text:data.NMTRANSP});
        //this.objFormConfiguracao.controls['IDG097'].setValue({id:data.IDG097,name:'opa'});
        this.objFormConfiguracao.controls['IDS001PA'].setValue({id:data.IDS001PA, text:data.NMUSUARIPA});
        this.selectedTipoAponta = data.IDG097;
        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes PermissoesFechamento", "getPermissoesFechamento", obj.IDG103, "fa fa-map");
  }


  savePermissoesFechamento(){

    if (this.objFormConfiguracao.invalid) {
      this.toastr.warning("Campos não preenchidos");
      return false;
    }

    var result = null,
        slotsValue = null;
        slotsValue = Object.assign({}, this.objFormConfiguracao.value);
        
    if (this.validaFormularioValido(this.objFormConfiguracao)) {

      var objSavePermissoesFechamento = this.objFormConfiguracao.value;
      this.utilServices.loadGridShow();
      //# update
      if (this.objFormConfiguracao.controls['IDG103'].value) {

        this.permissoesFechamentoService.updatePermissoesFechamento(slotsValue).subscribe(
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
        this.permissoesFechamentoService.addPermissoesFechamento(slotsValue).subscribe(
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
    var obj = JSON.parse(id);
    if(obj.IDS001PA == '' || obj.IDS001PA == null || obj.IDS001PA == 'undefined'){
      this.toastr.warning("Ação não permitida!");
    }else{
      //console.log(id); return false;
      this.idPermissoesFechamento = obj.IDG103;
      this.modal.open(this.modalDelete);
    }
  }

  deletePermissoesFechamento(ids){
    console.log(ids); return false;
    this.idPermissoesFechamento = ids;
    this.modal.open(this.modalDelete);
  }

  close(){
    this.modal.closeModal();
  }

  confirmaDeletePermissoesFechamento(){
    this.utilServices.loadGridShow();
    this.permissoesFechamentoService.deletePermissoesFechamento(this.idPermissoesFechamento).subscribe(
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
    this.grid.findDataTable(this.idDataGrid);
  }


  /*Se futuramente for verificar qual o tipo de apontamento para fazer alguma validação, basta colocar no HTML
  a função abaixo em (blur)*/

  // verificaApontamento(){
  //   console.log("Simbora", this.selectedTipoAponta);
    
  //   switch(this.selectedTipoAponta){
  //     case 46:
  //       this.objFormConfiguracao.controls["IDG090"].setValidators([Validators.required]);
  //       this.objFormConfiguracao.controls["IDG024"].setValidators([Validators.required]);
  //       console.log("Foi");
  //       break;
  //   }
  // }


}
