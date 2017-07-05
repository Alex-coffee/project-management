import { NgModule } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { OrderRawMaterialsComponent } from './order-raw-materials/order-raw-materials.component';

import { PeityModule } from 'app/components/charts/peity';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    PeityModule
  ],
  declarations: [RawMaterialsComponent, OrderRawMaterialsComponent],
  exports: [
    
  ]
})
export class MaterialsModule { }
