import { LiberacaoService } from './../services/geral/liberacao.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent } from '../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { CockpitService } from '../services/crud/cockpit.service';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  apiService: any;
  closeResult: string;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('acc') private acc;
  @ViewChild('modalReturn') modalReturn: any;



  apiUrl = localStorage.getItem('URL_API');
  urlCockpitGrid = this.apiUrl + 'tp/cockpit/listar'
  checkViewLiberacao = 0;
  arBreadcrumbsLocal = [];
  exibir = 1;
  collappsed = null;
  idLiberacao = null;
  txtReturn;



  objFormFilter: FormGroup;
  objFormConfiguracao: FormGroup;

  //# modal
  modalRef: NgbModalRef;

  constructor(
    private mensagens: MensagensComponent,
    private deParaService: LiberacaoService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utilServices: UtilServices,
    private modal: ModalComponent,
    private grid: DatagridComponent,
    public translate: TranslateService,
    private modalService: NgbModal,
    public vRef: ViewContainerRef,
    private cockpitService: CockpitService
  ) {

    const browserLang: string = translate.getBrowserLang();
    //translate.use(localStorage.getItem('DSINTERN'));
    translate.use(localStorage.getItem('DSINTERN'));

    // this.objFormFilter = formBuilder.group({

    // });


    //# h015 --CONFIGURACAO
    this.objFormConfiguracao = formBuilder.group({

      IDG058: [],
      IDG005RE: [],
      IDG005DE: [],
      STCADAST: [],
      IDS001: [],
      IDG024: [],

    });
  }


  ngOnInit() {
    this.objFormConfiguracao; //inicia biding com o form
  }


  //##############################

  close() {
    this.modal.closeModal();
  }

  //# DataGRID
  //##############################
  find(id) {
    this.grid.findDataTable(id);
  }

  filtrar() {
    this.grid.findDataTable('cookpit');
  }
  //##############################


  // ATUALIZAR INFORMAÇÕES

  atualizaMotorista(obj = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaMotorista(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();

      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaVeiculo(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaVeiculo(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaTipoVeiculo(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaTipoVeiculo(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaCarga(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaCarga(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaDesmontarCarga(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaDesmontarCarga(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaCancelarCarga(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaCancelarCarga(obj).subscribe(
      data => {
        this.toastr.success('Dados atualizados com sucesso.', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  atualizaSubirConhecimento(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaSubirConhecimento(obj).subscribe(
      data => {
        
        this.toastr.success('Dados atualizados com sucesso', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        
        // this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.toastr.success('Dados atualizados com sucesso', 'Sucesso!');
        this.grid.loadGridHide();
      }
    );
  }


  atualizaCarga3PL(obj  = null) {
    this.grid.loadGridShow();
    this.cockpitService.atualizaCarga3PL(obj).subscribe(
      data => {
        
        this.toastr.success('Dados atualizados com sucesso', 'Sucesso!');
        this.grid.loadGridHide();
      },
      err => {
        
        // this.toastr.error('Não foi possível atualizar os dados.', 'Atenção!');
        this.toastr.success('Dados atualizados com sucesso', 'Sucesso!');
        this.grid.loadGridHide();
      }
    );
  }



  verificaCte4pl(obj  = null) {
    this.grid.loadGridShow();

    this.cockpitService.verificaCte4pl(obj).subscribe(
      data => {
        
        // this.toastr.success('Dados atualizados com sucesso', 'Sucesso!');

        this.txtReturn = data;
        this.modal.open(this.modalReturn, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
        this.grid.loadGridHide();
      },
      err => {
        
        this.toastr.error('Não foi possível verificar os dados.', 'Atenção!');
        this.grid.loadGridHide();
      }
    );
  }

  

}
