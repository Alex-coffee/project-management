import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders/orders.component';
import { OrderRawMaterialsComponent } from './order-raw-materials/order-raw-materials.component';
import { ProductStaticComponent } from './product-static/product-static.component';
import { PeityModule } from 'app/components/charts/peity';

@NgModule({
  imports: [
    CommonModule,
    PeityModule
  ],
  declarations: [OrdersComponent, OrderRawMaterialsComponent, ProductStaticComponent]
})
export class OrderModule { }
