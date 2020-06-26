import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SegurancaPremiadaService    } from '../../services/geral/seguranca-premiada.service';
import { GlobalsServices } from '../../services/globals.services';
import { LancamentoCampanhaService } from '../../services/crud/lancamento-campanha.service';


@Component({
    selector: 'app-seguranca-premiada',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './seguranca-premiada.component.html',
    styleUrls: ['./seguranca-premiada.component.scss']
  })

export class SegurancaPremiadaComponent implements OnInit {
    apiService: any;
    private global = new GlobalsServices();
    @ViewChild('breadcrumbs') breadcrumbs;
    @ViewChild('acc') private acc;
    @ViewChild('modalLancamento') modalLancamento: any;
    @ViewChild('modalVisualizarFechamento') modalVisualizarFechamento: any;
    
    //##### FORMS
    objFormFilter:   FormGroup;

    //##### ARRAYS//OBJECTS
    arBreadcrumbsLocal = [];
    arGridLancamentos  = [];
    arListaFechamento  = [];
    telaGlobal         = [];
    objfilter          = {value:null};

    //##### INT
    controlViewTable    = 1;

    //##### STRING
    nmmotori   = '';
    nmtransp   = '';
    vltotal    = '';
    titleModal = 'Detalhamento da Pontuação';
    user       = localStorage.getItem('ID_USER');

    //##### URL
    url      = this.global.getApiHost();
    urlGrid  = this.url+'tp/segurancapremiada/listar';
  
    constructor(
    private mensagens : MensagensComponent,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private utilServices: UtilServices,
    private modal : ModalComponent,
    private grid : DatagridComponent,
    public  translate: TranslateService,
    private modalService: NgbModal,
    public  vRef: ViewContainerRef,
    public  segurancaPremiadaService : SegurancaPremiadaService,
    private lancamentoCampanhaService: LancamentoCampanhaService,
    )
    {

        const browserLang: string = translate.getBrowserLang();
        translate.use(localStorage.getItem('DSINTERN'));

        this.objFormFilter = formBuilder.group({
            MESINI: [],
            MESFIM: [],
            IDG099: [],
            IDG090: ['',Validators.required]
        });

        /**Valida os usuários que podem visualizar as ações de impressão de correspondência */
        if(this.user == '169' || this.user == '820' || this.user == '1062' || this.user == '1394'){
            this.telaGlobal = [{'id' : 86, 'metodo' : 'gerarArquivoM1', 'icone':'fas fa-file-pdf'},
                            {'id' : 89, 'metodo' : 'modalfechamento', 'icone':'fas fa-envelope-square'}];
        }

    }

    ngOnInit() {}
    
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

    filtrar(){

        console.log('Filtro::::',this.objFormFilter);
        if(this.validarFormularioValido(this.objFormFilter)){
            this.objfilter.value = this.objFormFilter.value;
            this.controlViewTable = 1;
            this.grid.findDataTable('lancGrid','objfilter');

        }else{
            this.toastr.error('Selecione a Campanha, por favor');
            this.grid.loadGridHide();
        }
        
    }

    visualizar(obj){

        this.grid.loadGridShow();
    
        obj = JSON.parse(obj);

        console.log(this.objFormFilter);
        this.arGridLancamentos = [];

        obj.MESINI = this.objFormFilter.value['MESINI'];
        obj.MESFIM = this.objFormFilter.value['MESFIM'];
        obj.IDG090 = this.objFormFilter.value['IDG090'];
        
        console.log(obj);

        //this.controlViewTable = 2;
    
        this.segurancaPremiadaService.buscaLancMotorista({obj}).subscribe(
        data=>{
            console.log("DATA === >> ",data);
            if(data.message != undefined){
                this.toastr.warning(data.message);
                this.grid.loadGridHide();
            }else{
                this.arGridLancamentos = data;      
                this.modal.open(this.modalLancamento, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
                this.grid.loadGridHide();
            }

        },
        err=>{
            console.log(err);
            if(err.error.message != undefined){
                this.toastr.error(err.error.message);
            }else{
                this.toastr.error('Erro na listagem das informações.');
            }
            this.goHome();
            this.grid.loadGridHide();
        }
        );
        
        
    }

    validarFormularioValido(objForm) {
        if (objForm.valid) {
            return true;
        } else {
            return false;
        }
    }

    gerarArquivoM1(){
        this.grid.loadGridShow();
        var obj = this.objFormFilter.value;

        if(obj.IDG090 != undefined && obj.IDG090.id != null){
            
            this.segurancaPremiadaService.downloadPdfM1(obj).subscribe(
            data => {

                console.log('receipt data');
                console.log(data);
                
                let url       = window.URL.createObjectURL(data);
                let link      = document.createElement('a');
                link.href     = url;
                link.download = 'Modelo_Endereco_'+obj.IDG090.text+'.pdf';

                link.dispatchEvent(new MouseEvent('click'));
                this.grid.loadGridHide();
            }, err => {
                console.log(err);
                this.toastr.error('Houve um problema ao gerar o arquivo.');
                this.grid.loadGridHide();
            })
        }else{
            this.toastr.error('Selecione a Campanha, por favor');
            this.grid.loadGridHide();
        }
        
    }

    modalfechamento(){
        this.grid.loadGridShow();

        this.arListaFechamento = [];
  
        this.objFormFilter.value['STLANCAM'] = 0;
        console.log(this.objFormFilter.value);
  
        this.lancamentoCampanhaService.getUsuariosFechamento(this.objFormFilter.value).subscribe(
          data=>{
  
            
            this.arListaFechamento = data;
            console.log(this.arListaFechamento);
            this.modal.open(this.modalVisualizarFechamento,{ size: 'xl', windowClass: 'modal-adaptive' });
            this.grid.loadGridHide();
          },
          err => {
            this.modal.closeModal();
            this.mensagens.mensagemErroPadrao(err);
            this.grid.loadGridHide();
          }
        );
    }

    gerarArquivoM2(){
        this.grid.loadGridShow();
        this.close();
        var obj = this.objFormFilter.value;

        if(obj.IDG090 != undefined && obj.IDG090.id != null){
            
            this.segurancaPremiadaService.downloadPdfM2(obj).subscribe(
            data => {

                console.log('receipt data');
                console.log(data);
                
                let url       = window.URL.createObjectURL(data);
                let link      = document.createElement('a');
                link.href     = url;
                link.download = 'Modelo_Cartas_'+obj.IDG090.text+'.pdf';

                link.dispatchEvent(new MouseEvent('click'));
                this.grid.loadGridHide();
            }, err => {
                console.log(err);
                this.toastr.error('Houve um problema ao gerar o arquivo.');
                this.grid.loadGridHide();
            })
        }else{
            this.toastr.error('Selecione a Campanha, por favor');
            this.grid.loadGridHide();
        }
        
    }

    close(){
        this.modal.closeModal();
    }
    
      
}