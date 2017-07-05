import { Component, OnInit } from '@angular/core';
import { BackendService } from 'app/services/backend.service';

import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';
import { GanttDataSet } from 'app/model/ganttDataSet';

@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css'],
  providers: [ BackendService ]
})
export class ProductionScheduleComponent implements OnInit {
  errorMessage: string;
  ganttDataSet: GanttDataSet;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getGanttData();
  }

  getGanttData() {
    this.backendService.getGanttDataByType("order")
    .subscribe(ganttDataSet => {
      this.ganttDataSet = ganttDataSet;
      console.log(ganttDataSet);
    }, error => {
      console.log(error);
      this.errorMessage = <any>error;
    });
  }

}
