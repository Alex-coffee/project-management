import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-storage-amount',
  templateUrl: './storage-amount.component.html',
  styleUrls: ['./storage-amount.component.css'],
  providers: [ DataService, OrResultService, ToolsService ]
})
export class StorageAmountComponent implements OnInit {
  dataList: any[] = [];
  public peityType:string = "bar";
  public peityOptions:any = { fill: ["#faa123"], width:100};

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
          this.dataList = orResult.StorageAmountResult;
        }
      });
  }

}
