import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { CommonModule } from '@angular/common';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { OrderRawMaterialsComponent } from './order-raw-materials/order-raw-materials.component';

import { PeityModule } from 'app/components/charts/peity';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    RouterModule,
    PeityModule
  ],
  declarations: [RawMaterialsComponent, OrderRawMaterialsComponent],
  exports: [
    
  ]
})
export class MaterialsModule { }
