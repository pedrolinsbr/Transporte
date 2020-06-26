import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelpDeskService } from '../../services/crud/help-desk.service';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-help-desk-sla-delivery',
  templateUrl: './help-desk-sla-delivery.component.html',
  styleUrls: ['./help-desk-sla-delivery.component.scss']
})
export class HelpDeskSlaDeliveryComponent implements OnInit {

  objFormFilter: FormGroup;
  objFormFilterAux: FormGroup;
  selectedTpAcao = 0;
  tipoAcao = [{ id: 1, name: "Criar" }, { id: 2, name: "Cancelar" }, { id: 3, name: "Encerrar" }, { id: 4, name: "Editar" }];
  transpAtual = ""; 
  STCTE = '';
  STMDF = '';
  emissaoCTE = '';
  propIndicadores = [];


  arIdsIDG043  = [];

  constructor(
    private formBuilder: FormBuilder,
    private suporteService: HelpDeskService,
    private utilServices: UtilServices,
    private mensagens: MensagensComponent,
    private toastr: ToastrService,


  ) {

    this.objFormFilter = formBuilder.group({
      IDG043 : [],

    });

    this.objFormFilterAux = formBuilder.group({
      IDG043 : [],

    });

  }


  objStyle     = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };



  ngOnInit() {
    
  }



  

  IdsG043
  objDelivery = {};

  filtroSLA() {

    this.IdsG043 = '';


    if(this.arIdsIDG043.length > 0 ){
      for(let i of this.arIdsIDG043){
        this.IdsG043 += i.name + ',';
      }
      this.IdsG043 = this.IdsG043.slice(0, -1);

      this.objFormFilterAux.controls['IDG043'].setValue(this.IdsG043);
    }else{
      this.objFormFilterAux.controls['IDG043'].setValue(null);
    }

    this.utilServices.loadGridShow();
    this.suporteService.verificaSLA(this.objFormFilterAux.value)
      .subscribe(
        data => {

          this.objDelivery = data;

          console.log(this.objDelivery);

        
        this.utilServices.loadGridHide();
        },
        err => {
          this.toastr.warning('Insira deliveries válidas.');
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
