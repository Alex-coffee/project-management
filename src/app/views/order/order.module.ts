import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { OrdersComponent } from './orders/orders.component';
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
  declarations: [OrdersComponent, ProductStaticComponent, MaterialPurchasingComponent]
})
export class OrderModule { }
