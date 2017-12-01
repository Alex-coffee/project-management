import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  providers: [ DataService, OrResultService, ToolsService ]
})
export class KpiComponent implements OnInit {
  lineKPIList: any[] = [];
  storageKPIList: any[] = [];
  totalDays: number = 0;
  days:string[] = [];
  dateRanges: any[] = [];
  p: any;
  p2: any;

  constructor(
    private dataService: DataService,
    private toolsService: ToolsService,
    private orResultService: OrResultService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    // this.dataService.getKPI()
    //   .subscribe(res => {
    //     this.lineKPIList = res.lineKPI;
    //     this.storageKPIList = res.storageKPI;
    //     this.totalDays = res.totalDays;
    //     if(this.totalDays > 0){
    //       for(let i = 0; i < this.totalDays; i++){
    //         this.days.push("第" + i + "天");
    //       }
    //     }
    //   });

    const currentScenarioObj = JSON.parse(localStorage.getItem('currentScenario'));
    this.dateRanges = this.toolsService.getDateArrayByRange(new Date(currentScenarioObj.startDate),
    new Date(currentScenarioObj.endDate));

      this.orResultService.getCurrentScenarioResult().subscribe(res => {
        console.log(res)
        if(res.list.length > 0){
          var orResult = res.list[0];
          this.lineKPIList = orResult.LineKPIs;
          this.storageKPIList = orResult.storageKPIs;
        }
      });
  }

}
