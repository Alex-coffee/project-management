import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { LineStaticComponent } from './line-static/line-static.component';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { ParametersComponent } from './parameters/parameters.component';
import { PeityModule } from 'app/components/charts/peity';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    PeityModule
  ],
  declarations: [LineStaticComponent, RawMaterialsComponent, ParametersComponent]
})
export class BasicModule { }
