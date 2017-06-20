import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {OrdersComponent} from "./orders/orders.component";
import {ProcessComponent} from "./process/process.component";
import {WorkersComponent} from "./workers/workers.component";
import {RawMaterialsComponent} from "./raw-materials/raw-materials.component";
import {ProcessResultComponent} from "./process-result/process-result.component";

import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { D3ChartDirective } from './d3-chart.directive';
import { ProcessGanttDirective } from './process-result/process-gantt.directive';

@NgModule({
  declarations: [
    OrdersComponent,
    ProcessComponent,
    WorkersComponent,
    RawMaterialsComponent,
    ProcessResultComponent,
    D3ChartDirective,
    ProcessGanttDirective
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
    ProcessComponent,
    WorkersComponent,
    RawMaterialsComponent,
    ProcessResultComponent
  ],
})

export class ProcessManagementViewModule {
}
