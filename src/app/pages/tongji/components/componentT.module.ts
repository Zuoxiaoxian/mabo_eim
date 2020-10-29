import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { MySelectComponent } from '../components/my-select/my-select.component';
import { MySelectGroupComponent } from '../components/my-select-group/my-select-group.component';
import { MyTableNg2Component } from '../components/my-table-ng2/my-table-ng2.component';
import { FormsModule } from '@angular/forms';
import { NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';


import {Ng2SmartTableModule} from '@mykeels/ng2-smart-table';

@NgModule({
  declarations: [
    MySelectComponent, MySelectGroupComponent,MyTableNg2Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbSelectModule,
    NbInputModule,
    NbIconModule,
    Ng2SmartTableModule,
  ],
  exports: [
    MySelectComponent, MySelectGroupComponent,MyTableNg2Component,
  ]
})
export class ComponentTModule { }
