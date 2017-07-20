import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ProductionScheduleComponent } from './production-schedule/production-schedule.component';
import { RawMaterialDemandsComponent } from './raw-material-demands/raw-material-demands.component';
import { StorageAmountComponent } from './storage-amount/storage-amount.component';
import { UncoveredDemandsComponent } from './uncovered-demands/uncovered-demands.component';
import { ParametersComponent } from './parameters/parameters.component';

import { GanttDirective } from 'app/directive/gantt.directive';
import { PeityModule } from 'app/components/charts/peity';
import { KpiComponent } from './kpi/kpi.component';

@NgModule({
  imports: [
    CommonModule,
    PeityModule,
    FormsModule
  ],
  declarations: [GanttDirective, ProductionScheduleComponent, ParametersComponent,
    RawMaterialDemandsComponent, StorageAmountComponent, UncoveredDemandsComponent, KpiComponent]
})
export class ScheduleModule { }
