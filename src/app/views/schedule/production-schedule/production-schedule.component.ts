import { Component, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import { BackendService } from 'app/services/backend.service';
import { OptimizeService } from 'app/services/optimize.service';

import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';
import { GanttDataSet } from 'app/model/ganttDataSet';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GanttDirective } from 'app/directive/gantt.directive';


@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css'],
  providers: [ BackendService, OptimizeService ]
})
export class ProductionScheduleComponent implements OnInit {
  @ViewChild(GanttDirective) gantt: GanttDirective;
  errorMessage: string;
  ganttDataSet: GanttDataSet;
  currentType: string = "line";
  inProcess:boolean = false;

  constructor(
    private backendService: BackendService, 
    private optimizeService: OptimizeService, 
    public toastr: ToastsManager, vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.getGanttData();
  }

  setGanttType(type){
    this.currentType = type;
    if(this.currentType == "order"){
      this.gantt.setGanttType("order");
    }else{
      this.gantt.setGanttType("line");
    }
    this.getGanttData();
  }

  getGanttData() {
    this.backendService.getGanttDataByType(this.currentType)
    .subscribe(ganttDataSet => {
      this.ganttDataSet = ganttDataSet;
      console.log(ganttDataSet);
    }, error => {
      console.log(error);
      this.errorMessage = <any>error;
    });
  }

}
