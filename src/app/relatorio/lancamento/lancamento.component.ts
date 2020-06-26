import { LancamentoService } from '../../services/crud/lancamento.service';
import { LancamentoCampanhaService } from '../../services/crud/lancamento-campanha.service';
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
  selector: 'app-lancamento',
  templateUrl: './lancamento.component.html',
  styleUrls: ['./lancamento.component.scss']
})
export class LancamentoComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  
  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "Lancamento";
  urlLancamentoGrid = this.apiUrl+'tp/lancamentoCampanha/listarMotoristasRelatorio'
  arBreadcrumbsLocal  = [];
  arIds               = [];
  exibir              = 1;
  collappsed          = null;
  objfilter = {value:null};


  objFormFilter:   FormGroup;
  objFormConfiguracao:   FormGroup;

  //# modal
  modalRef: NgbModalRef;


  arListaApontamentos = [];
  arListaApontaUser   = [];
  arListaApontaUserAUX = [];



    constructor(
      private mensagens : MensagensComponent,
      public LancamentoService: LancamentoService,
      public lancamentoCampanhaService: LancamentoCampanhaService,
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
      //translate.use(localStorage.getItem('DSINTERN'));
      translate.use(localStorage.getItem('DSINTERN'));

      this.objFormFilter = formBuilder.group({

        IDG090: [''],
        CDMES:['', Validators.required],
        IDG031: [[]]

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

      this.lancamentoCampanhaService.getApontamentoExistentesUser().subscribe(
        data=>{
          this.arListaApontaUser = data;
          this.arListaApontaUserAUX = data;
          console.log(data);
        }
      );

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



  getdados(obj){
    this.utilServices.loadGridShow();
    this.LancamentoService.getdados(obj).subscribe(
      data=>{
        this.objFormConfiguracao.controls['IDG024'].setValue(data.IDG024);
        this.objFormConfiguracao.controls['CDESTARE'].setValue(data.CDESTARE);
        this.objFormConfiguracao.controls['CDESTADE'].setValue(data.CDESTADE);

        this.exibir = 2;
        this.utilServices.loadGridHide();
      }
    );
    this.set(1,"Detalhes Syngenta", "getdados", obj.IDG036, "fa fa-map");
  }




  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }
   Ids = {in:[]}

  filtrar(){
    this.grid.findDataTable(this.idDataGrid);
  }

    limpar(){
      this.objFormFilter.reset();
      this.arIds = [];
      this.filtrar();
    }
    
  }
  //##############################



