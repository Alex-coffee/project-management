import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
import { OrderRawMaterialsComponent } from './order-raw-materials/order-raw-materials.component';
import { ProductStaticComponent } from './product-static/product-static.component';
import { PeityModule } from 'app/components/charts/peity';
import { MaterialPurchasingComponent } from './material-purchasing/material-purchasing.component';
import {SelectModule} from 'ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ModalModule.forRoot(),
    PeityModule
  ],
  declarations: [OrdersComponent, OrderRawMaterialsComponent, ProductStaticComponent, MaterialPurchasingComponent]
})
export class OrderModule { }
