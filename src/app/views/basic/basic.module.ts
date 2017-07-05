import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineStaticComponent } from './line-static/line-static.component';
import { RawMaterialsComponent } from './raw-materials/raw-materials.component';
import { ParametersComponent } from './parameters/parameters.component';
import { PeityModule } from 'app/components/charts/peity';

@NgModule({
  imports: [
    CommonModule,
    PeityModule
  ],
  declarations: [LineStaticComponent, RawMaterialsComponent, ParametersComponent]
})
export class BasicModule { }
