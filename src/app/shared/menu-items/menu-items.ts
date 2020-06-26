import { Injectable } from '@angular/core';

export interface BadgeItem {
    type: string;
    value: string;
}

export interface ChildrenItems {
    state: string;
    name: string;
    type?: string;
}

export interface Menu {
    state: string;
    name: string;
    type: string;
    icon: string;
    badge?: BadgeItem[];
    children?: ChildrenItems[];
}

let MENUITEMS:any;
MENUITEMS = '';

@Injectable()
export class MenuItems {

    getAll() {
        return MENUITEMS;
    }

    add(menu: Menu) {
        MENUITEMS = menu;
        //MENUITEMS.push(  {
      //state: 'cadastros',
     // name: 'Cadastros Gerais',
      //type: 'sub',
      //icon: 'basic-book-pencil',
      //children: [
        //   {
        //       state: 'municipios',
        //       name: 'Municipios'
        //   },
        //   {
        //       state: 'municipios',
        //       name: 'Municipios'
        //   },
        //   {
        //     state: 'checklist',
        //     name: 'Checklist'
        //   },
        //   {
        //     state: 'dashboard',
        //     name: 'Dashboard'
        //   },
        //   {
        //     state: 'controle-portaria',
        //     name: 'Controle Portaria'
        //   },
      //]
      
  //});
    }

    tamMenu() {
        return MENUITEMS.length;
    }

    clear(){
        MENUITEMS = null;
      }

}
