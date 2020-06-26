import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelpDeskService } from '../../services/crud/help-desk.service';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-help-desk-cte',
  templateUrl: './help-desk-cte.component.html',
  styleUrls: ['./help-desk-cte.component.scss']
})
export class HelpDeskCteComponent implements OnInit {

  objFormFilter: FormGroup;
  selectedTpAcao = 0;
  tipoAcao = [{ id: 1, name: "Criar" }, { id: 2, name: "Cancelar" }, { id: 3, name: "Encerrar" }, { id: 4, name: "Editar" }];
  transpAtual = ""; 
  STCTE = '';
  STMDF = '';
  emissaoCTE = '';
  propIndicadores = [];
  constructor(
    private formBuilder: FormBuilder,
    private suporteService: HelpDeskService,
    private utilServices: UtilServices,
    private mensagens: MensagensComponent,

  ) {

    this.objFormFilter = formBuilder.group({
      IDG024: [],
      IDG051: [],
      CDCTRC: [],
      MDF: [],
      IDG067: [],
      CDAUTOR: [],
      SNDOWN: [],
      IDCARLOG: [] 

    });

  }



  ngOnInit() {
    
  }

  validaForm(){
    let valid = true;
    //Valida transportadora 
    if (this.utilServices.validaField(this.objFormFilter.controls['IDG024'].value)) {
      valid = true;
      $("ng-select[ng-reflect-name='IDG024'] ").removeClass('invalid');  
      //Valida campo MDF
      if (!this.utilServices.validaField(this.objFormFilter.controls['MDF'].value)) {
        valid = false;        
        $('input[ng-reflect-name="MDF"]').addClass('cmpRequired');
      }else{
        $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
      }       
    }
    
    //Valida campo MDF
    if (this.utilServices.validaField(this.objFormFilter.controls['MDF'].value)) {
      valid = true;
      $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');    
      //Valida transportadora 
      if (!this.utilServices.validaField(this.objFormFilter.controls['IDG024'].value)) {
        valid = false;
        $("ng-select[ng-reflect-name='IDG024'] ").addClass('invalid');  
      }else{
        $("ng-select[ng-reflect-name='IDG024'] ").removeClass('invalid');  
      } 
    }else{
      valid = false;
      $('input[ng-reflect-name="MDF"]').addClass('cmpRequired');
    } 


/* 
    if(!this.utilServices.validaField(this.objFormFilter.controls['CARGA'].value) ){
      valid = false;
      //Valida campo carga
      if (!this.utilServices.validaField(this.objFormFilter.controls['CARGA'].value)) {
        valid = false;
        $('input[ng-reflect-name="CARGA"]').addClass('cmpRequired');
      }else{
        $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
      }
    }else{
      //Valida campo MDF
      if (!this.utilServices.validaField(this.objFormFilter.controls['MDF'].value)) {
        valid = false;        
        $('input[ng-reflect-name="MDF"]').addClass('cmpRequired');
      }else{
        $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
      } 
      //Valida transportadora 
      if (!this.utilServices.validaField(this.objFormFilter.controls['IDG024'].value)) {
        valid = false;
        $("ng-select[ng-reflect-name='IDG024'] ").addClass('invalid');  
      }else{
        $("ng-select[ng-reflect-name='IDG024'] ").removeClass('invalid');  
      } 
     } */

    

    return valid;
  }

  

  getInfoCTE() {
    this.utilServices.loadGridShow();
    this.suporteService.getInfoCTE(this.objFormFilter.value)
      .subscribe(
        data => {
          
          if(typeof data.response != "undefined"){
            this.mensagens.MensagemInfo(data.response, '');
          }else{
            this.STCTE = data.STCTRC;
            this.emissaoCTE = data.DTEMICTR;

            if (data.DTENTREG == null) {
              $('#dtEntreg').addClass('red');
            } else {
              $('#dtEntreg').addClass('green');
            }

            if (data.DTENTCON == null) {
              $('#dtEntcon').addClass('red');
            } else {
              $('#dtEntcon').addClass('green');
            }

            if (data.CARGALOG == null) {
              $('#carlog').addClass('red');
            } else {
              $('#carlog').addClass('green');
            }
            if (data.CARGAEVO == null) {
              $('#carevo').addClass('red');
            } else {
              $('#carevo').addClass('green');
            }                     
            if (data.DELIVCANCEL == 0 ) {
              $('#deliveryC').addClass('green');
            } else {
              $('#deliveryC').addClass('red');
            }

            if (data.G043_SNDELETE == 0 ) {
              $('#SnDelete43').addClass('green');
            } else {
              $('#SnDelete43').addClass('red');
            }

            if (data.G083_SNDELETE == 0 ) {
              $('#SnDelete83').addClass('green');
            } else {
              $('#SnDelete83').addClass('red');
            }

            if (data.CARGA4PL == 0) {
              $('#carga4Pl').addClass('red');
            } else {
              $('#carga4Pl').addClass('green');
            }
            
            if (data.IDG024AT == 0) {
              $('#transpAtual').addClass('red');
              this.transpAtual = '';
            } else {
              $('#transpAtual').addClass('green');
              this.transpAtual = data.NMTRANSP;
            }

            if (data.STCTRC == 'C') {
              $('#statusCte').addClass('red');
            } else {
              $('#statusCte').addClass('green');
            }
            
            if (data.CTEINTEGRADO == 0 ) {
              $('#cteIntegrado').addClass('red');
            }else {
              $('#cteIntegrado').addClass('green');
            }  
            
        }
        this.utilServices.loadGridHide();
        },
        err => {
          $('.red').removeClass('red');
          $('.green').removeClass('green');
          $('#cteIntegrado').addClass('red');
          this.utilServices.loadGridHide();
        }
      );
  }


  limpar(){
    this.utilServices.loadGridShow();
    this.objFormFilter.reset();
    this.utilServices.loadGridHide();
  } 

  remRequiredField(){
    $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
    $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
    $("ng-select[ng-reflect-name='IDG024'] ").removeClass('invalid');
  }
} 
