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
import { OrResultService } from 'app/services/or-result.service';
import { OrInputService } from 'app/services/or-input.service';


@Component({
  selector: 'app-production-schedule',
  templateUrl: './production-schedule.component.html',
  styleUrls: ['./production-schedule.component.css'],
  providers: [ BackendService, OptimizeService, ScenarioService, 
    LineService, ToolsService, OrResultService, OrInputService]
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
  p: any;

  constructor(
    private backendService: BackendService, 
    private optimizeService: OptimizeService, 
    private scenarioService: ScenarioService,
    private lineService: LineService,
    private toolsService: ToolsService,
    private orResultService: OrResultService,
    private orInputService: OrInputService,
    public toastr: ToastsManager, vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.getGanttData();
    this.getProductScheduleData();
    this.getLineInfo();
  }

  getScenarioDateStrByIndex(i: number) {
    const scenarioDates = this.toolsService.getScenarioDates();
    return scenarioDates[i];
  }

  exportORResult(){
    this.toolsService.exportORResult().then(res => {
        const csvData = res["csvData"];
        var csvRow = [];
        csvRow.push(csvData.fieldNames.join(","));
        if(csvData.data){
            csvData.data.forEach(item => {
                let rowData = [];
                csvData.fields.forEach(f => {
                  rowData.push(item[f]);
                });
                csvRow.push(rowData.join(","));
            });
        }

        var csvString = csvRow.join("\n");
        var a = document.createElement('a');
        a.href = 'data:attachment/csv;charset=utf-8,%EF%BB%BF' +  encodeURIComponent(csvString);
        a.target = '_blank';
        a.download = '生产计划_' + (new Date().getTime()) + ".csv";
        document.body.appendChild(a);
        a.click();
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
    this.orResultService.getCurrentScenarioResult().subscribe(res => {
      console.log(res)
      if(res.list.length > 0){
        var orResult = res.list[0];
        this.productionScheduleList = orResult.ProductionScheduleResult;
      }
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
