// #### ANGULAR
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// #### SERVICE
import { MdfeService    } from './../services/geral/mdf-e.service';
import { ToastrService   } from 'ngx-toastr';

// #### COMPONENTES
import { DatagridComponent } from '../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mdf-download',
  templateUrl: './mdfDownload.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: []
})
export class MdfDownload implements OnInit {

  objParam = {IDF001:null};

  constructor(
    private route: ActivatedRoute,
    public  mdfeService    : MdfeService,
    public  toastr         : ToastrService,
    private grid           : DatagridComponent)
    {

    }

  ngOnInit() {
    this.grid.loadGridShow();

    this.route.params.subscribe(res => this.objParam = {
          IDF001: res.id
    });

    console.log(this.objParam);

    this.mdfeService.downloadPdfMdfe(this.objParam).subscribe(
        data => {
          this.grid.loadGridShow();
          console.log('receipt data');
          console.log(data);
          
          let url       = window.URL.createObjectURL(data);
  
          let link      = document.createElement('a');
          link.href     = url;
          link.target   = '_self';
  
          link.dispatchEvent(new MouseEvent('click'));
          this.grid.loadGridHide();
        }, err => {
          console.log(err);
          this.toastr.error('Não foi possível gerar o arquivo PDF');
          this.grid.loadGridHide();
        }

      )
  }

}
