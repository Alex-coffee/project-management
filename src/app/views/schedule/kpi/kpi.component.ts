import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';


@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css'],
  providers: [ DataService, OrResultService ]
})
export class KpiComponent implements OnInit {
  lineKPIList: any[] = [];
  storageKPIList: any[] = [];
  totalDays: number = 0;
  days:string[] = [];

  constructor(
    private dataService: DataService,
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

      this.orResultService.getCurrentScenarioResult().subscribe(res => {
        console.log(res)
        this.lineKPIList = res.lineKPI;
        this.storageKPIList = res.storageKPI;
      });
  }

}
