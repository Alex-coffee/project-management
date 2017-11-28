import { Component, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import { BackendService } from 'app/services/backend.service';
import { OptimizeService } from 'app/services/optimize.service';

import { ScenarioService } from 'app/services/scenario.service';
import { LineService } from 'app/services/line.service';
import { ToolsService } from 'app/utils/tools.service';
import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';
import { GanttDataSet } from 'app/model/ganttDataSet';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { GanttDirective } from 'app/directive/gantt.directive';


@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css'],
  providers: [ BackendService, OptimizeService, ScenarioService, LineService, ToolsService]
})
export class ProductionScheduleComponent implements OnInit {
  @ViewChild(GanttDirective) gantt: GanttDirective;
  errorMessage: string;
  ganttDataSet: GanttDataSet;
  productionScheduleList: any[] = [];
  currentType: string = "line";
  inProcess:boolean = false;
  fileGenerated:boolean = false;
  lineMap: any = {};

  constructor(
    private backendService: BackendService, 
    private optimizeService: OptimizeService, 
    private scenarioService: ScenarioService,
    private lineService: LineService,
    private toolsService: ToolsService,
    public toastr: ToastsManager, vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.getGanttData();
    this.getProductScheduleData();
    this.getLineInfo();
  }

  exportORResult(){
    this.toolsService.exportORResult().then(res => {
      console.log(res);
      this.fileGenerated = true;
    });
  }

  getLineInfo(){
    this.lineService.find({}).subscribe(data => {
      const lines = data.list;
      lines.forEach(line => {
        this.lineMap[line._id] = line; 
      })
    });
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

  getProductScheduleData(){
    this.backendService.getProductionScheduleResult().subscribe(data => {
      this.productionScheduleList = data;
    }, error => {
      this.errorMessage = <any>error;
    });
  }

  getGanttData() {
    this.backendService.getGanttDataByType(this.currentType)
    .subscribe(ganttDataSet => {
      this.ganttDataSet = ganttDataSet;
    }, error => {
      console.log(error);
      this.errorMessage = <any>error;
    });
  }

}
