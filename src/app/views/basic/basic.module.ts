import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { SelectModule } from 'ng-select';
import { LineStaticComponent } from './line-static/line-static.component';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { OrderRawMaterialsComponent } from './order-raw-materials/order-raw-materials.component';
import { PeityModule } from 'app/components/charts/peity';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ModalModule.forRoot(),
    PeityModule
  ],
  declarations: [LineStaticComponent, RawMaterialsComponent, OrderRawMaterialsComponent]
})
export class BasicModule { }
