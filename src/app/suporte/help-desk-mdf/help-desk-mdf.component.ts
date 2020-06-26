import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelpDeskService } from '../../services/crud/help-desk.service';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-help-desk-mdf',
  templateUrl: './help-desk-mdf.component.html',
  styleUrls: ['./help-desk-mdf.component.scss']
})
export class HelpDeskMdfComponent implements OnInit {

  objFormFilter: FormGroup;
  selectedTpAcao = 0;
  tipoAcao = [{ id: 1, name: "Criar" }, { id: 2, name: "Cancelar" }, { id: 3, name: "Encerrar" }, { id: 4, name: "Editar" }];
  txtMdfAtivo = '';
  STCARGA = '';
  STMDF = '';
  propIndicadores = [];
  constructor(
    private formBuilder: FormBuilder,
    private suporteService: HelpDeskService,
    private utilServices: UtilServices,
    private mensagens: MensagensComponent,

  ) {

    this.objFormFilter = formBuilder.group({
      IDG024: [],
      TPACAO: [],
      CARGA: [],
      MDF: [],
      IDG067: [],
      CDAUTOR: [],
      SNDOWN: [],
      IDCARLOG: []

    });

  }



  ngOnInit() {
    this.getIndMdfVenc();
  }

  validaForm(){
    let valid = true;
    //Valida transportadora 
    if (this.utilServices.validaField(this.objFormFilter.controls['IDG024'].value)) {
      valid = true;
      $("ng-select[ng-reflect-name='IDG024']").removeClass('invalid');
      $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
      $('input[ng-reflect-name="IDCARLOG"]').removeClass('cmpRequired');
      //Valida campo MDF
      if (!this.utilServices.validaField(this.objFormFilter.controls['MDF'].value)) {
        valid = false;        
        $('input[ng-reflect-name="MDF"]').addClass('cmpRequired');
      }else{
        $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
      }       
    }else{
      valid = false;        
      $("ng-select[ng-reflect-name='IDG024']").addClass('invalid');  
    }
    
    //Valida campo MDF
    if (this.utilServices.validaField(this.objFormFilter.controls['MDF'].value)) {
      valid = true;
      $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
      $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
      $('input[ng-reflect-name="IDCARLOG"]').removeClass('cmpRequired');
      //Valida transportadora 
      if (!this.utilServices.validaField(this.objFormFilter.controls['IDG024'].value)) {
        valid = false;
        $("ng-select[ng-reflect-name='IDG024']").addClass('invalid');
      }else{
        $("ng-select[ng-reflect-name='IDG024']").removeClass('invalid');
      } 
    }else{
      valid = false;
      $('input[ng-reflect-name="MDF"]').addClass('cmpRequired');
    } 

    if (!valid) { 
      //Carga
      if ( !this.utilServices.validaField(this.objFormFilter.controls['CARGA'].value) && !this.utilServices.validaField(this.objFormFilter.controls['IDCARLOG'].value) ) {
        $('input[ng-reflect-name="CARGA"]').addClass('cmpRequired');
        $('input[ng-reflect-name="IDCARLOG"]').addClass('cmpRequired');
        valid = false;      
      }else if(this.utilServices.validaField(this.objFormFilter.controls['CARGA'].value)) {   
        $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
        $('input[ng-reflect-name="IDCARLOG"]').removeClass('cmpRequired');
        $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
        $("ng-select[ng-reflect-name='IDG024']").removeClass('invalid');  
        valid = true;      
      }else if(this.utilServices.validaField(this.objFormFilter.controls['IDCARLOG'].value)) {
        $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
        $('input[ng-reflect-name="IDCARLOG"]').removeClass('cmpRequired');
        $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
        $("ng-select[ng-reflect-name='IDG024']").removeClass('invalid');  
        valid = true;      
      }else{
     }
    }

    return valid;
  }
  //Appenda dados do formulario com ao formdata de lista de arquivos.
  getInfoMdf() {
    
    if (this.validaForm() ) {
      if (this.objFormFilter.controls['CARGA'].value != '' || this.objFormFilter.controls['IDCARLOG'].value != '' ) {
        this.getInfoByCarga();
      } else if (this.objFormFilter.controls['MDF'].value != '') {        
        this.getInfoByMdf();
      }else {
        this.mensagens.MensagemErro("Confira o preenchimento dos campos e tente novamente.", '');        
      }
    } else {      
      this.mensagens.MensagemErro("Erro ao buscar as informações, verifique os filtros usados e tente novamente.", '');      
    }
    
  }

  getInfoByCarga() {
    this.utilServices.loadGridShow();
    this.suporteService.getInfoByCarga(this.objFormFilter.value)
      .subscribe(
        data => {
          this.STCARGA = data.STCARGA ;
          if(typeof data.response != "undefined"){
            this.mensagens.MensagemInfo(data.response, '');
          }else{
            if (data.STCARGA != 'C') {
              $('#isCancel').addClass('green');
            } else {
              $('#isCancel').addClass('red');
            }

            if (data.HASVEICULO == 0) {
              $('#hasVeiculo').addClass('red');
            } else {
              $('#hasVeiculo').addClass('green');
            }

            if (data.HASMOTORISTA == 0) {
              $('#hasMotorista').addClass('red');
            } else {
              $('#hasMotorista').addClass('green');
            }
           

            if (this.TestaCPF(data.HASMOTOVALID)) {
              $('#hasMotorValid').addClass('green');
            } else {
              $('#hasMotorValid').addClass('red');
            }

            if (data.HASCTECANCEL) {
              $('#hasCteCancel').addClass('red');
            } else {
              $('#hasCteCancel').addClass('green');
            }

            if (data.ISINTERMUNI == 0) {
              $('#isInterMunicipal').addClass('red');
            } else {
              $('#isInterMunicipal').addClass('green');
            }
            
            if (data.ISDELIVERYATIVA == 0) {
              $('#isDeliAtiva').addClass('green');
            } else {
              $('#isDeliAtiva').addClass('red');
            }
            
            if (data.HASMANIFMOTVEI == null  || !data.HASMANIFMOTVEI  ) {
              $('#hasManifesto').addClass('green');
              this.txtMdfAtivo = '';
            }else {
              $('#hasManifesto').addClass('red');
              this.txtMdfAtivo = '('+data.HASMANIFMOTVEI+')';
            }                  
        }
        this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.MensagemErro(err, '');
          this.utilServices.loadGridHide();
        }
      );
  }

  TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
  if (strCPF == "00000000000") 
    return false;     
  for (var i=1; i<=9; i++){
    Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;   
  if ((Resto == 10) || (Resto == 11)){
      Resto = 0;
  }      
  if (Resto != parseInt(strCPF.substring(9, 10)) ){
    return false;
  }      
  Soma = 0;
    for (var j = 1; j <= 10; j++){
      Soma = Soma + parseInt(strCPF.substring(j-1, j)) * (12 - j);
    }
    Resto = (Soma * 10) % 11;
    if ((Resto == 10) || (Resto == 11)){
      Resto = 0;
    }
      
    if (Resto != parseInt(strCPF.substring(10, 11) ) ){
      return false;    
    }      
    return true;    
}

  getInfoByMdf() {
    this.utilServices.loadGridShow();
    this.suporteService.getInfoByMdf(this.objFormFilter.value)
      .subscribe(
        async data => {
          this.objFormFilter.controls['CARGA'].setValue(data.IDG046);
          if (data.STMDF != null) {
            this.STMDF = data.STMDF ;
            if (data.TIMEAUTMDF > 24) {
              $('#timeAutMdf').addClass('red');
            } else {
              $('#timeAutMdf').addClass('green');
            }
            if (data.STMDF == 'A') {
              $('#isAllow').addClass('green');
            } else {
              $('#isAllow').addClass('red');
            }

            if (data.STMDF == 'A') {            
              $('#situacaoMin').addClass('green');
            } else {            
              $('#situacaoMin').addClass('red');
            }

            if (data.STMDF == 'E') {
              $('#isErro').addClass('green');
            } else {
              $('#isErro').addClass('red');
            }
            if (data.VALIDCHAVE > 0) {
              $('#validaChave').addClass('red');
            } else {
              $('#validaChave').addClass('green');
            }

            
          }else{
            this.mensagens.MensagemInfo('Código de MDFe não encontrado.', '');
          }

          if(this.utilServices.validaField(this.objFormFilter.controls['CARGA'].value)){
            await this.getInfoByCarga();
          } 
          
        },
        err => {
          this.mensagens.MensagemErro(err, '');
        }
      );
    this.utilServices.loadGridHide();
  }

  limpar(){
    this.utilServices.loadGridShow();
    this.objFormFilter.reset();
    this.utilServices.loadGridHide();
  } 

  getIndMdfVenc() {
    this.propIndicadores = [];
    this.utilServices.loadGridShow();
    this.suporteService.getIndMdfVenc(this.objFormFilter.value)
      .subscribe(
        data => {
          //this.propIndicadores = data;
          for (let i of data) {
            let cor = 'rgb(93, 199, 215)';
            let icon = 'fas fa-handshake';
            if(i.QTDMDF > 0){
              cor = 'rgb(255, 17, 52)';
              icon = 'fas fa-clock'; 
            }
            let coisa = {'NMTRANSP': i.NMTRANSP.split(' ')[1], 'QTDMDF': i.QTDMDF, 'COR':cor, 'ICON':icon};
            this.propIndicadores.push(coisa) ;
            coisa = null;
          }
          this.utilServices.loadGridHide();
        },
        err => {
          this.mensagens.MensagemErro(err, '');
        }
      );
  }


  remRequiredField(){
    $('input[ng-reflect-name="CARGA"]').removeClass('cmpRequired');
    $('input[ng-reflect-name="MDF"]').removeClass('cmpRequired');
    $("ng-select[ng-reflect-name='IDG024'] ").removeClass('invalid');
  }
} 
