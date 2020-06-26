import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MontarCargaService } from './../services/geral/montarCarga.service';
import { UtilServices } from './../shared/componentesbravo/src/app/services/util.services';
import { DragulaService } from 'ng2-dragula';
import { ToastrService } from 'ngx-toastr';
import { GlobalsServices } from '../services/globals.services';
import * as $ from 'jquery';
import { ModalComponent} from '../shared/componentesbravo/src/app/componentes/modal/modal.component';


import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';


@Component({
  selector: 'app-montar-carga',
  templateUrl: './montar-carga.component.html',
  styleUrls: ['./montar-carga.component.scss']
})
export class MontarCargaComponent implements OnInit {
  private global = new GlobalsServices();
  closeResult: string;

  objFormFilter: FormGroup;
  objFormFilterH: FormGroup;

  objFormAux: FormGroup;
  objFormConfiguracao:   FormGroup;

  carregando          = false;
  arBreadcrumbsLocal  = [];
  exibir              = null;
  desabilitar = 0;

  url = this.global.getApiHost();

  tags:string[]  = ['AngularJS','Angluar2']
  @ViewChild('modalConfirma') modalConfirma: any;
  @ViewChild('modalConfirmaAceite') modalConfirmaAceite: any;
  @ViewChild('inputChip') inputChip: any;

  constructor(
    private modalService   : NgbModal,
    private formBuilder    : FormBuilder,
    public cargaService    : MontarCargaService,
    private dragulaService : DragulaService,
    private modal          : ModalComponent,
    public toastr          : ToastrService,
    public utils           : UtilServices
  ) {

    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel();
    });

    this.dragulaService.drop.subscribe(value => {
      console.log(value);
    });

    this.objFormFilter = formBuilder.group({
      IDG028: [],
      tomador: [],
      IDG043: [],
      testao: []
    });

    this.objFormFilterH = formBuilder.group({
			G043_IDG005RE:		 [],
			G043_IDG005DE:		 [],
      G043_IDG043:       []
    });

    this.objFormAux = formBuilder.group({
      IDG030:     []
    });

   }

   dataSelecionada = [{}];
   dataMinima      = [{}];
   dataMaxima      = [{}];
   dataInicial     = [{}];
   dataFinal       = [{}];

  ngOnInit() {
    this.buscarMontarCarga();
    this.carregando = false;
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';
  }



  pesoCarga    = 0.00;
  vlCarga      = 0.00;
  click        = [];
  todos        = true;
  classBtn     = 'success';
  btnNome      = 'Marcar';
  checar       = false;
  selecionados = [];
  dadosCarga   = [];
  remetente    = null;




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


  adiciona(nota, peso, valor, obj, event){
    console.log('aaa', event, this.click.length, this.remetente, obj, obj);
    let valida = 0;
    let adiciona = 1;

    if(this.click.length == 0){
        this.remetente = null;
    }

    if(this.remetente == null){
       this.remetente = obj.IDG005RE;
    }


    if(this.remetente !=  obj.IDG005RE){
      this.toastr.error('Remetente inválido. Favor, informar o mesmo remetente do pedido selecionado anteriormente.');
      return false;
    }else{

    //Marca e Desmarca ( Soma ou Subtrai as informações da carga )
          if(this.click.length >= 1){
              for(let i = 0; i <= this.click.length; i++){
                if(this.click[i] == nota){
                    this.click.splice(i, 1);
                    this.pesoCarga = this.pesoCarga - peso;
                    this.vlCarga = this.vlCarga - valor;
                    valida = 1;
                    console.log('aqui');
                }
              }
              if(valida == 0){
                  this.click.push(nota);
                  this.pesoCarga = this.pesoCarga + peso;
                  this.vlCarga   = this.vlCarga + valor;
                   console.log('aqui2');
              }else{
                console.log('aqui3');
              }
          } else {
              this.click.push(nota);
              this.pesoCarga = this.pesoCarga + peso;
              this.vlCarga   = this.vlCarga + valor;
              console.log('aqui4');
          }
      }

      this.remetente = obj.IDG005RE;
    }

    marcaTodos(){
      // limpa os campos caso ja estejam preenchidos em outro momento
      this.pesoCarga = 0;
      this.vlCarga   = 0;
      this.click     = [];

      // Quando clica em marcar todos
      if(this.classBtn == 'success'){
          // for(let i = 0; i < this.grade.length; i++){
          //     this.pesoCarga  = this.pesoCarga + this.grade[i].PSBRUTO;
          //     this.vlCarga    = this.vlCarga + this.grade[i].VRDELIVE;
          //     this.click.push(this.grade[i].CDDELIVE);
          // }

          $('.checkmark').click();


          this.classBtn = 'danger';
          this.btnNome  = 'Desmarcar';
          //this.checar    = true;
      } else {
          //Quando clica em desmarcar todos

          $('.checkmark').click();
          this.click = null;
          this.click = [];
          this.pesoCarga = 0;
          this.vlCarga   = 0;
          this.classBtn = 'success';
          this.btnNome  = 'Marcar';
          //this.checar    = false;
      }
    }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  dataClick(event){
    //console.log("Data clicada(De): ", event)
  }

  dataClickAte(event){
    //console.log("Data clicada(Ate): ", event)
  }

  grade = []

  buscarMontarCarga(){
    /* if(this.cargaService.disparar){ */
      let form = this.objFormFilterH.value;
      let obj = {data:''};
      this.cargaService.buscarMontarCarga(form)
        .subscribe(
        data => {
          this.dadosCarga = data.data;

          this.montarCarga();
          this.carregando = true;
        },
       /*   error =>{
          this.toastr.warning('Não há grade disponível para o dia selecionado!');
          this.loading = false;
          this.semGrade = true;
        } */
      );
    /* } */
  }

  montarCarga(){

    for(let i in this.dadosCarga){
      let obj = {};
      obj = {
        CDDELIVE:     this.dadosCarga[i].CDDELIVE,
        DESTINATARIO: this.dadosCarga[i].DESTINATARIO,
        DTLANCTO:     this.dadosCarga[i].DTLANCTO,
        IDG043:       this.dadosCarga[i].IDG043,
        PSBRUTO:      this.dadosCarga[i].PSBRUTO,
        pesoFormat:   this.utils.formataPeso(this.dadosCarga[i].PSBRUTO),
        REMETENTE:    this.dadosCarga[i].REMETENTE,
        VRDELIVE:     this.dadosCarga[i].VRDELIVE,
        valorFormat:  this.utils.formataDinheiro(this.dadosCarga[i].VRDELIVE),
        IDG005RE:     this.dadosCarga[i].IDG005RE,
        IDG005DE:     this.dadosCarga[i].IDG005DE,

        NMG003RE:     this.dadosCarga[i].NMG003RE,
        NMG003DE:     this.dadosCarga[i].NMG003DE,

        NRLATITURE:   this.dadosCarga[i].NRLATITURE,
        NRLONGITRE:   this.dadosCarga[i].NRLONGITRE,

        NRLATITUDE:   this.dadosCarga[i].NRLATITUDE,
        NRLONGITDE:   this.dadosCarga[i].NRLONGITDE


      };
      this.grade.push(obj);
    }
  }

  cancelarDeliveries(){
    console.log(this.selecionados);
    let arOrdem = [];
    let arIDG043 = this.click

    for (let key in this.click){
        arOrdem.push(this.click[key])
    }

    console.log(arOrdem);
    let deliveries = arOrdem.join(',');

    this.cargaService.cancelarDeliveries({IDG043:deliveries})
    .subscribe(
      data => {
        this.toastr.success(data.response);
        this.buscarMontarCarga();
        this.click = [];
        this.modal.closeModal();
      },
      error => {
        this.modal.closeModal();
        console.log(error);
      });

  }

  salvarMontarCarga(){

    console.log('lol>>>', this.dadosCarga);
    if(this.objFormAux.controls['IDG030'].value == null){
      this.toastr.error('Favor, preencher o tipo de veículo');
      return false;

    }

    this.desabilitar = 1;
    this.toastr.info('Aguarde até a mensagem de finalização do processo aparecer.');

    this.utils.loadGridShow();
    let idg030 = this.objFormAux.controls['IDG030'].value.text;

    console.log(this.selecionados);
    let arOrdem = [];
    let arDeliveries = [];
    let arIDG043 = this.click;
    let distanceKm = 0;

    let pedidoUm   = null;
    let pedidoFim  = null;

    let nomeUm   = null;
    let nomeFim  = null;

    let start = null;
    let end = null;


    for (let key in this.click){
      let objOrdem = {IDG043:'', NRORDEM:0};
      objOrdem.IDG043 = this.click[key];
      objOrdem.NRORDEM = parseInt(key) + 1;

      arOrdem.push(objOrdem);
      arDeliveries.push(this.click[key]);

      if(pedidoUm == null){
        pedidoUm = this.click[key];
      }

      pedidoFim = this.click[key];
    }

    for (var i = this.dadosCarga.length - 1; i >= 0; i--) {
      if(this.dadosCarga[i].IDG043 == pedidoUm){
          nomeUm = this.dadosCarga[i].NMG003RE;
          start = [this.dadosCarga[i].NRLATITURE,  this.dadosCarga[i].NRLONGITRE];
          console.log('>>', nomeUm, start);
      }

      if(this.dadosCarga[i].IDG043 == pedidoFim){
          nomeFim = this.dadosCarga[i].NMG003DE;
          end = [this.dadosCarga[i].NRLATITUDE,  this.dadosCarga[i].NRLONGITDE];
          console.log('>>', nomeFim, end);
      }

    }
    let that = this;
    var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[1] + ',' + start[0] + ';' + end[1] + ',' + end[0] + '?steps=false&language=pt-BR&geometries=geojson&access_token=' + mapboxgl.accessToken;
    
    console.log("directionsRequest::::", directionsRequest);

    $.ajax({
      method: 'GET',
      url: directionsRequest,
    }).done(function(data){
      
     // debugger;

      var route = data.routes[0].distance;
      console.log('>>>>>', data);
      distanceKm = (route/1000);

     let strDeliveries = arDeliveries.join(',');
     let obj = {ARCARGA: arOrdem,
                IDG043:strDeliveries,
                IDG030: idg030,
                NMVIAGEM: nomeUm+" X "+nomeFim,
                DISTANCE: distanceKm};

   
    //return false;

    that.cargaService.salvarMontarCarga(obj)
      .subscribe(
        data => {
          console.log(data);
          //that.MudarStFinali(arIDG043);
          that.filtrar();
          that.toastr.success(data.response);
          console.log('++++++++',that.desabilitar);
          that.desabilitar = 0;
          console.log('========',that.desabilitar);
          that.modal.closeModal();


          that.click = null;
          that.click = [];
          that.pesoCarga = 0;
          that.vlCarga   = 0;
          that.classBtn = 'success';
          that.btnNome  = 'Marcar';
          that.utils.loadGridHide();

        },
        error => {
          console.log(error);
          //that.modal.closeModal();
          that.utils.loadGridHide();

        });

        //that.utils.loadGridHide();

    }).fail(function(error){
      console.log('error', error);
      that.utils.loadGridHide();
    });


     //return false;



/*
      this.cargaService.salvarMontarCarga(obj)
      .subscribe(
        data => {
          console.log(data);
          //this.MudarStFinali(arIDG043);
          this.filtrar();
          this.toastr.success(data.response);
          this.modal.closeModal();


          this.click = null;
          this.click = [];
          this.pesoCarga = 0;
          this.vlCarga   = 0;
          this.classBtn = 'success';
          this.btnNome  = 'Marcar';

        },
        error => {
          console.log(error);
          //this.modal.closeModal();

        });
        */

  }//FINAL

  private onDropModel(){

  }
  MudarStFinali(arID043){
    let obj = {STFINALI:1, IDG043:arID043}
    this.cargaService.mudarStFinali(obj)
      .subscribe(
        data => {
          this.buscarMontarCarga();
          this.toastr.success("Lista de deliveries atualizada");
          this.click = [];
        },
        error => {
          console.log(error);
        });
  }
  Ids: any;
  filtrar(){
    this.Ids = ' ';
    this.grade = [];
    this.click = [];
    this.pesoCarga = 0;
    this.vlCarga   = 0;
    this.carregando = true;
    if(this.chips.length > 0 ){
      for(let i of this.chips){
        this.Ids += i.name+', '
      }
      this.Ids = this.Ids.substring(0, (this.Ids.length - 2));
      this.objFormFilterH.controls['G043_IDG043'].setValue(this.Ids);
    }else{
      this.objFormFilterH.controls['G043_IDG043'].setValue(null);
    }
    this.buscarMontarCarga();
    this.carregando = false;

  }

	limpar(){
    this.objFormFilter.reset();
    this.chips = [];
		this.objFormFilterH.reset();

	}

  action:any;
  openModalConfirma(context){
    switch(context){
      case 'A':
        this.action = 'aceitar';
        break;
      case 'C':
        this.action = 'cancelar';
        break;
    }
    this.modal.open(this.modalConfirma);
  }


  openModalConfirmaAceite(context){

    //console.log(this.click.length == 0);
    if(this.click.length == 0){
      this.toastr.error('Selecione ao menos um pedido');

    }else{
      this.modal.open(this.modalConfirmaAceite);
    }

  }


  confirma(action){
    switch(action){
      case 'aceitar':
        // console.log('Chama salvar');
        this.salvarMontarCarga();
        break;
      case 'cancelar':
        // console.log('Chama recusar');
        this.cancelarDeliveries();
        break;
    }
  }

  chips = [];
  objStyle             = {
    'background' : '#43295b',
    'color'      : '#ffffff',
    'iconColor'  : '#ffffff',
    'iconOpacity': '0.5'
  };

}
