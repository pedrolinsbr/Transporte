import { DocumentoViagemService } from '../../services/crud/documentoViagem.service';
import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import * as $ from 'jquery';

@Component({
  selector: 'app-documento-viagem',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './documento-viagem.component.html',
  styleUrls: ['./documento-viagem.component.css']
})
export class DocumentoViagemComponent implements OnInit {
  apiService: any;

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;

  @ViewChild('acc') private acc;
  token = localStorage.getItem('token');
  apiUrl = localStorage.getItem('URL_API');
  idDataGrid = 'idDataGridFiles';
  urlGrid = this.apiUrl + 'tp/documentoViagem/listar'
  checkViewDocumento = 0;
  arBreadcrumbsLocal = [];
  exibir = 1;
  collappsed = null;
  createdIDT014: "";
  idDocumento: any;
  objUser : any;
  snAdmin = 0;

  objFormFilter: FormGroup;
  objFormNewDoc: FormGroup;

  selectedTpAutor: 1;
  selectedSnBaixado: 1;
  tipoAutor = [{ id: 1, name: "Motorista" }/*, { id: 2, name: "Veículo" }, { id: 3, name: "Tipo de Veículo" }, { id: 4, name: "Cliente" }*/];
  optSnBaixado = [{ id: 1, name: "Sim" }, { id: 0, name: "Não" }];
  arUpload: any = [];
  filestring: any;
  files: Set<File>;


  //url
  urlFieldsEdiAll = this.apiUrl + 'tp/edi/getAllFieldsEdi';

  //# modal
  modalRef: NgbModalRef;
  uploaderA: FileUploader;
  uploadResult: any = [];

  uploader: FileUploader = new FileUploader({
    url: this.apiUrl + 'tp/documentoViagem/file?token=' + this.token,
    method: 'put',
    additionalParameter:
    {
      NMTABELA: 'A004',
      IDS001: localStorage.getItem('ID_USER'),
      IDT014: 0,
      isHTML5: true,
    }
  });

  formData = new FormData();

  constructor(
    private mensagens: MensagensComponent,
    private docService: DocumentoViagemService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utilServices: UtilServices,
    private modal: ModalComponent,
    private grid: DatagridComponent,
    public translate: TranslateService,
    public vRef: ViewContainerRef,

  ) {

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.uploadResult = {
        "success": true, "item": item, "response":
          response, "status": status, "headers": headers
      };
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      this.uploadResult = {
        "success": false, "item": item,
        "response": response, "status": status, "headers": headers
      };
    };
    this.uploader.onCompleteAll = () => {
      console.log('CompleteAll');
    };

    const browserLang: string = translate.getBrowserLang();
    //translate.use(localStorage.getItem('DSINTERN'));
    translate.use(localStorage.getItem('DSINTERN'));

    this.objFormFilter = formBuilder.group({
      IDT014: [],
      IDAUTOR: [],
      STCADAST: [],
      IDG067: [],
      CDAUTOR: [],
      SNDOWN: []

    });


    //# h015 --CONFIGURACAO
    this.objFormNewDoc = formBuilder.group({
      IDT014: [],
      CDAUTOR: [],
      IDAUTOR: [],
      DSOBSERV: [],
      FILES: [],
      DTVALID: [],
      IDUSUCAD: localStorage.getItem('IDS001'),
      FormaDataFiles: new FormData()

    });
  }


  ngOnInit() {
    this.objUser = JSON.parse(localStorage.getItem('user'));
    this.snAdmin = this.objUser.SNADMIN;
    this.objFormNewDoc;
    this.selectedTpAutor = 1;
  }

  validaFormularioValido(objForm) {
    if (objForm.valid) {
      return true;
    } else {
      return false;
    }
  }


  set(id, name, functionName, parameter, icon) {//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    for (let item of this.arBreadcrumbsLocal) {
      if (item.id == data.id || item.name == name) {
        valid = false;
      }
    }
    if (valid) {
      this.arBreadcrumbsLocal.push(data);
    }
  }

  resetCamposFiltro(){
    this.objFormFilter.controls.IDAUTOR.reset();

  }
  goHome(event) { //IR PARA TELA INICIAL
    this.objFormNewDoc.controls.IDAUTOR.reset();
    this.objFormNewDoc.controls.DSOBSERV.reset();
    document.getElementById('custom-file-label').innerHTML = 'Escolha o arquivo';
    $("#file").val('');
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
  }

  clearNext(item) { //LIMPAR PROXIMOS PASSOS
    let ar = [];
    for (let itemFor of this.arBreadcrumbsLocal) {
      ar.push(itemFor);
      if (item.id == itemFor.id) {
        break;
      }
    }
    this.arBreadcrumbsLocal = ar;
  }



  //# Modal Delte
  //##############################

  //Abre tela para inserir novo documento
  showNewFile() {
    //
    this.uploader.queue = [];
    this.selectedTpAutor = 1;
    this.exibir = 2
    this.set(1, "Adicionar " + this.breadcrumbs.home, "showNewFile", null, "fa fa-plus");

  }


  /******************************************************************************************
 * @description  Quando um arquivo é selecionado cria o formdata e chama e appenda os dados do arquivo
 * @author Pedro lins
 * @since 03/10/2019
 *
 * @async
 * @function fileChange
********************************************************************************************/
  
  fileChange() {
    let filenames = [];        
    let ultimo_item = this.uploader.queue[this.uploader.queue.length-1].file.name;
    let txtInput = document.getElementById('custom-file-label').innerHTML;
    if(!txtInput.match(ultimo_item)){
      console.log('Nao repetido');
      if (this.uploader.queue.length > 0) {
        for (let i = 0; i < this.uploader.queue.length; i++) {
          let nomeArquivo = this.uploader.queue[i].file.name;
          filenames.push(nomeArquivo);          
          document.getElementById('custom-file-label').innerHTML = filenames.join(', ');
          this.formData.append('image', this.uploader.queue[i].file.rawFile);
        }
      }  
    }else{
      console.log('Repetido');
      this.uploader.queue.pop();
      this.toastr.warning("Arquivo já selecionado.");
    }

    

  }

  resetFileInput(){
    this.uploader.queue =[];
    document.getElementById('custom-file-label').innerHTML = "Escolha o arquivo"
  }

  //Appenda dados do formulario com ao formdata de lista de arquivos.
  saveAndUpload() {
    this.formData.append('IDT014', this.createdIDT014); //Apenda o valor de IDT014 no formdata
    this.formData.append('CDAUTOR', this.objFormNewDoc.controls.CDAUTOR.value);
    this.formData.append('DSOBSERV', this.objFormNewDoc.controls.DSOBSERV.value);
    this.formData.append('IDAUTOR', this.objFormNewDoc.controls.IDAUTOR.value.id);
    this.formData.append('IDUSUCAD', this.objFormNewDoc.controls.IDUSUCAD.value);
    if (this.formData) {
      this.utilServices.loadGridShow();
      this.docService.upload(this.formData)
        .subscribe(
          data => {
            this.formData = new FormData(); //Limpa formdata
            this.toastr.success("Documento adicionado com sucesso!");
            this.exibir = 1;
            this.goHome(event);
            this.utilServices.loadGridHide();
            this.grid.findDataTable('idDataGridFiles');
          },
          err => {
            this.mensagens.MensagemErro(err, '');
          }
        );
    } else {
      this.toastr.warning("Erro ao fazer upload de Documento, arquivo pode estar fora do padrão. Tente novamente.");
    }
  }

  //Botao download documento
  downloadDocumento(id) {
    var nomeArquivo = '';
    var idT014 = '';
    $('input[type="hidden"][id^="' + id + '"]').each(function (obj) {
      var arrayLinha = JSON.parse(($(this).val()));
      nomeArquivo = arrayLinha.NMANEXO;
      idT014 = arrayLinha.IDT014;
    });
    var obj = { "IDA004": id, "IDT014": idT014, IDS001: localStorage.getItem('ID_USER') };
    this.utilServices.loadGridShow();
    this.docService.downloadDocumento(obj).subscribe(
      data => {
        console.log('receipt data');
        console.log(data);
        let url = window.URL.createObjectURL(data);
        var link = document.createElement('a');
        link.href = url;
        link.download = nomeArquivo;
        link.dispatchEvent(new MouseEvent('click'));
        this.grid.findDataTable('idDataGridFiles');
        this.utilServices.loadGridHide();
      }, err => {
        this.toastr.error('Não foi possível realizar a operação');
        this.utilServices.loadGridHide();
      }
    )
  }

  //Abre modal para confirmar delete de documento
  openDeleteDoc(id) {
    this.idDocumento = id;
    this.modal.open(this.modalDelete);
  }

  //Confirma deletar documento
  confirmaDeleteDocumento() {
    var idT014 = '';
    $('input[type="hidden"][id^="' + this.idDocumento + '"]').each(function (obj) {
      var arrayLinha = JSON.parse(($(this).val()));
      idT014 = arrayLinha.IDT014;
    });

    var obj = { "IDA004": this.idDocumento , "IDT014": idT014};
    this.docService.deleteDocumento(obj).subscribe(
      data => {
        this.mensagens.MensagemSucesso(data.response, '');
        this.grid.findDataTable('idDataGridFiles');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }


  getDocumentoByAutor() {
    let IDAUTOR = this.objFormFilter.controls['IDAUTOR'].value.id;
    let CDAUTOR = this.objFormFilter.controls['CDAUTOR'].value;
    var obj = { "CDAUTOR": CDAUTOR, "IDAUTOR": IDAUTOR };
    this.docService.getDocumentoByAutor(obj).subscribe(
      data => {
        if (data.data.length  > 1){
          this.mensagens.MensagemInfo('Existem '+data.data.length +' documentos para este autor', '');
        }else if(data.data.length == 1 ){
          this.mensagens.MensagemInfo('Existe '+data.data.length +' documento para este autor', '');
        }else{
          this.mensagens.MensagemInfo('Não existe documento para este autor', '');
        }
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }

  close() {
    this.modal.closeModal();
  }
  //# DataGRID
  //##############################
  find(id) {
    this.grid.findDataTable(id);
  }

  filtrar() {
    try {
      this.grid.findDataTable('idDataGridFiles');      
    } catch (e) {
      console.log(e);
    }
  }

  limpar() {
    this.objFormFilter.controls.IDAUTOR.reset();
    this.objFormFilter.controls.SNDOWN.reset();
    this.filtrar();
  }
  //##############################


}
