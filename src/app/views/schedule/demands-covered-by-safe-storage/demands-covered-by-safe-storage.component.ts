import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-demands-covered-by-safe-storage',
  templateUrl: './demands-covered-by-safe-storage.component.html',
  styleUrls: ['./demands-covered-by-safe-storage.component.css'],
  providers: [ DataService, OrResultService, ToolsService ]
})
export class DemandsCoveredBySafeStorageComponent implements OnInit {
  dataList: any[] = [];

  constructor(
    private dataService: DataService,
    private orResultService: OrResultService,
    private toolsService: ToolsService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  getScenarioDateStrByIndex(i: number) {
    const scenarioDates = this.toolsService.getScenarioDates();
    return scenarioDates[i];
  }

  loadData(){

    this.orResultService.getCurrentScenarioResult().subscribe(res => {
        console.log(res)
        if(res.list.length > 0){
          var orResult = res.list[0];
          this.dataList = orResult.DemandsCoveredBySafeStorage;
        }
      });
  }

}