import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';

@Component({
  selector: 'app-uncovered-demands',
  templateUrl: './uncovered-demands.component.html',
  styleUrls: ['./uncovered-demands.component.css'],
  providers: [ DataService, OrResultService ]
})
export class UncoveredDemandsComponent implements OnInit {
  dataList: any[] = [];

  constructor(
    private dataService: DataService,
    private orResultService: OrResultService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){

    this.orResultService.getCurrentScenarioResult().subscribe(res => {
        console.log(res)
        if(res.list.length > 0){
          var orResult = res.list[0];
          this.dataList = orResult.UncoveredDemands;
        }
      });
  }

}
