import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NaturezaCargaService } from '../../services/crud/natureza-carga.service';

@Component({
  selector: 'app-natureza-carga',
  templateUrl: './natureza-carga.component.html',
  styleUrls: ['./natureza-carga.component.scss']
})
export class NaturezaCargaComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalConfirma') private modalConfirma;

  @ViewChild('acc') private acc;

  apiUrl              = localStorage.getItem('URL_API');
  idDataGrid          = "natureza";
  urlNaturezaGrid      = this.apiUrl+'tp/naturezaCarga/listar'
  checkViewCluster    = 0;
  arBreadcrumbsLocal  = [];
  exibir              = 1;
  collappsed          = null;



  objFormFilter:   FormGroup;
  objFormConfig: FormGroup;

  //# modal
  modalRef: NgbModalRef;

  /*
  Tabela cluster T005
  T005.IDT005,
  T005.DSCLUSTE,
  T005.SNDELETE
  */

    constructor(
      private mensagens : MensagensComponent,
      private naturezaCargaService: NaturezaCargaService,
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
        TPPRODUT: [],
  
      });

      this.objFormConfig = formBuilder.group({  
        T019:     [],     
        SNVALIDA: [],
  
      });


      
    }


    ngOnInit() {

    }

    obj;

    openModalConfirmaAprovacao(objt){

      this.obj = JSON.parse(objt);
      
      this.objFormConfig.controls['SNVALIDA'].setValue(1);
      this.objFormConfig.controls['T019'].setValue(this.obj);
      
      this.modal.open(this.modalConfirma);
      
  
    }
  
  
    openModalConfirmaReprovacao(objt){
      this.obj = JSON.parse(objt);

      
      this.objFormConfig.controls['SNVALIDA'].setValue(0);
      this.objFormConfig.controls['T019'].setValue(this.obj);


      this.modal.open(this.modalConfirma);
      
    }

    confirmaAlteraValida(){

      this.naturezaCargaService.updateValida(this.objFormConfig.value).subscribe(
        data=>{
          this.toastr.success("Alterado com Sucesso!");
          this.modal.closeModal();
          this.grid.loadGridShow();
          this.grid.findDataTable(this.idDataGrid);
          this.grid.loadGridHide();
          
        },
        err=>{
          
          this.grid.loadGridHide();
        }
      );

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

  goHome(event){ //IR PARA TELA INICIAL
    this.objFormConfig.reset()
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
  }



  



  close(){
    this.modal.closeModal();
  }



  
  //##############################
  //# DataGRID
  //##############################
  find(id){
    this.grid.findDataTable(id);
  }

  filtrar(){

    this.grid.findDataTable(this.idDataGrid);
    
  }
  //##############################


}
