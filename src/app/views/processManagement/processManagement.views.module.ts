import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { OrdersComponent } from "./orders/orders.component";
import { ProcessResultComponent } from "./process-result/process-result.component";

import { PeityModule } from 'app/components/charts/peity';
import { SparklineModule } from 'app/components/charts/sparkline';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3ChartDirective } from './d3-chart.directive';
import { ProcessGanttDirective } from './process-result/process-gantt.directive';
import { StorageAmountComponent } from './storage-amount/storage-amount.component';
import { UncoveredDemandsComponent } from './uncovered-demands/uncovered-demands.component';
import { LineStaticComponent } from './line-static/line-static.component';
import { ProductStaticComponent } from './product-static/product-static.component';

@NgModule({
  declarations: [
    OrdersComponent,
    ProcessResultComponent,
    D3ChartDirective,
    ProcessGanttDirective,
    StorageAmountComponent,
    UncoveredDemandsComponent,
    LineStaticComponent,
    ProductStaticComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    RouterModule,
    PeityModule,
    SparklineModule
  ],
  exports: [
    OrdersComponent,
    ProcessResultComponent,
    D3ChartDirective,
    ProcessGanttDirective,
    StorageAmountComponent,
    UncoveredDemandsComponent,
    LineStaticComponent,
    ProductStaticComponent
  ],
})

export class ProcessManagementViewModule {
}
