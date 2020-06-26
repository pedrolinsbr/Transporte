// ##### IMPORTS
import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

// ##### COMPONENTES
import { MensagensComponent } from '../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent } from '../shared/componentesbravo/src/app/componentes/modal/modal.component';

// ##### SERVICES
import { MaloteService } from './../services/geral/malote.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../services/globals.services';


import { DeliverysNewService } from '../shared/componentesbravo/src/app/services/crud/deliveryNew.service';

@Component({
  selector: 'app-malote',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './malote.component.html',
  styleUrls: ['./malote.component.scss']
})
export class MaloteComponent implements OnInit {
  apiService: any;

  private global = new GlobalsServices();

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('acc') private acc;
  @ViewChild('modalSuccess') modalSuccess: any;
  @ViewChild('modalCanhoto') modalCanhoto: any;
  @ViewChild('modalVeiculo') modalVeiculo: any;
  @ViewChild('modalMotorista') modalMotorista: any;
  @ViewChild('modalMapa') modalMapa: any;
  @ViewChild('focus') focus: ElementRef;

  // ##### URL's
  apiUrl = localStorage.getItem('URL_API');
  idDataGrid = "dePara";
  urlMobileGrid = this.apiUrl + 'tp/mobile/listar';
  url = this.global.getApiHost();

  // ##### ARRAYS
  chadocs: any = [];
  mdfs: any = [];
  ctes: any = [];
  nfs: any = [];
  invalid: any = [];
  valided: any = [];
  user;

  titleInput: String = 'Chave do Manifesto Eletrônico';
  carga: String = '';
  motorista: String = '';
  idMotorista: String = '';
  isValid: Boolean = false;
  finished = false;
  isCargaValid = false;

  // ##### FORMS
  objForm: FormGroup;

  // ##### MODAL
  modalRef: NgbModalRef;

  constructor(
    private mensagens: MensagensComponent,
    private maloteService: MaloteService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utilServices: UtilServices,
    private modal: ModalComponent,
    public translate: TranslateService,
    private modalService: NgbModal,
    public vRef: ViewContainerRef,
    public deliveryService: DeliverysNewService,
  ) {

    const browserLang: string = translate.getBrowserLang();
    //translate.use(localStorage.getItem('DSINTERN'));
    translate.use(localStorage.getItem('DSINTERN'));
    // ##### FORM FILTER
    this.objForm = formBuilder.group({
      NRCHADOC: [], //CHAVE MDF-e
    });
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    setTimeout(() => {
      this.focus.nativeElement.focus();
    }, 1000);
  }

  clean() {
    this.ctes = [];
    this.mdfs = [];
    this.nfs = [];
    this.chadocs = [];
    this.invalid = [];
    this.valided = [];
    this.isValid = false;
    this.finished = false;
    this.carga = '';
    this.motorista = '';
    this.idMotorista = '';
    this.isCargaValid = false;
    this.titleInput = 'Chave do Manifesto Eletrônico';
    this.objForm.reset();
  }

  handleSearch(event) {
    let NRCHADOC = this.objForm.controls['NRCHADOC'].value;
    let data = {
      NRCHADOC: NRCHADOC != null ? NRCHADOC.trim() : NRCHADOC
    }
    if (event != undefined && (event.code === "Tab" || event.code === "Enter") && !this.isValid) {
      // if (NRCHADOC.length == 44) {
        this.buscarListChadoc(data);
      // } else {
      //   alert('A chave do documento está inválida!')
      // }
    } else if (event != undefined && (event.code === "Tab" || event.code === "Enter") && this.isValid) {
      // if (NRCHADOC.length == 44) {
        this.checkChadoc(NRCHADOC);
      // } else {
      //   alert('A chave do documento está inválida!')
      // }
    }
  }

  handleSearchBtn() {
    let NRCHADOC = this.objForm.controls['NRCHADOC'].value;
    let data = {
      NRCHADOC: NRCHADOC != null ? NRCHADOC.trim() : NRCHADOC
    }
    // if (NRCHADOC != null && NRCHADOC.length == 44) {
      this.buscarListChadoc(data);
    // } else {
    //   alert('A chave do documento está inválida!')
    // }
  }

  buscarListChadoc(chadoc) {
    this.utilServices.loadGridShow()
    this.maloteService.buscaChadocs(chadoc).subscribe(
      data => {
        this.isCargaValid = data.chadocs.valid;
        this.titleInput = 'Chave do Documento'
        this.utilServices.loadGridHide();
        if (data.chadocs.ctes != undefined) {
          this.carga = data.chadocs.ctes[0].IDG046;
          this.motorista = data.chadocs.mdfs[0].NMMOTORI;
          this.idMotorista = data.chadocs.mdfs[0].IDG031M1;
          this.isValid = true;
        }
        this.ctes = data.chadocs.ctes;
        this.mdfs = data.chadocs.mdfs;
        this.chadocs = [...data.chadocs.ctes, ...data.chadocs.mdfs, ...data.chadocs.nfs];
        this.checkChadoc(chadoc.NRCHADOC);
      },
      error => {
        this.objForm.reset();
        this.focus.nativeElement.focus();
        this.utilServices.loadGridHide();
        this.toastr.error(error.error.msg)
      }
    )
  }

  checkChadoc(chadoc) {
    setTimeout(() => {
      this.objForm.reset();
      this.focus.nativeElement.focus();
    }, 0);
    let exists = this.valided.filter(item => item == chadoc);
    if (exists.length > 0) {
      this.toastr.warning('Documento já foi validado!');                  
    } else {
      let valid = this.chadocs.filter(item => item.NRCHADOC == chadoc);
      if (valid.length == 0) {
        this.toastr.error('Documento Inválido');
        this.invalid.push({ NRCHADOC: chadoc });
      } else {
        this.valided.push(chadoc);
        this.ctes = this.ctes.map(item => {
          if (item.NRCHADOC === chadoc) {
            item.STCHADOC = 0;
          }
          item.nfs = item.nfs.map(nf => {
            if (nf.NRCHADOC === chadoc) {
              nf.STCHADOC = 0;
            }
            return nf;
          })
          return item;
        });
        this.mdfs = this.mdfs.map(item => {
          if (item.NRCHADOC === chadoc) {
            item.STCHADOC = 0;
          }
          return item;
        });
        this.toastr.success('Documento Validado');
        if (this.valided.length === this.chadocs.length && this.invalid.length == 0) {
          this.salvarValidacao();
        }
      }
    }
  }

  removeChadocInvalid(event, chadoc) {
    this.invalid = this.invalid.filter(item => item.NRCHADOC != chadoc);
    if (this.valided.length === this.chadocs.length && this.invalid.length == 0) {
      this.salvarValidacao();
    }
  }

  salvarValidacao() {
    let data = {
      chadocs: [...this.chadocs],
      IDS001: this.user.IDS001
    }
    this.utilServices.loadGridShow();
    this.maloteService.saveValidation(data).subscribe(
      data => {
        this.utilServices.loadGridHide();
        this.modal.open(this.modalSuccess, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
        this.clean();
      },
      error => {
        if (this.valided.length === this.chadocs.length && this.invalid.length == 0) {
          this.finished = true;
        }
        this.utilServices.loadGridHide();
      }
    )
  }

  validarNovamente() {
    this.isCargaValid = false;
  }

  countChecked(array) {
    let valid = array.filter(item => item.STCHADOC === 0);
    return `${valid.length} / ${array.length}`;
  }
}
