import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductionScheduleComponent } from './production-schedule/production-schedule.component';
import { RawMaterialDemandsComponent } from './raw-material-demands/raw-material-demands.component';
import { StorageAmountComponent } from './storage-amount/storage-amount.component';
import { UncoveredDemandsComponent } from './uncovered-demands/uncovered-demands.component';

import { GanttDirective } from 'app/directive/gantt.directive';
import { PeityModule } from 'app/components/charts/peity';

@NgModule({
  imports: [
    CommonModule,
    PeityModule
  ],
  declarations: [GanttDirective, ProductionScheduleComponent, RawMaterialDemandsComponent, StorageAmountComponent, UncoveredDemandsComponent]
})
export class ScheduleModule { }
