import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-raw-material-demands',
  templateUrl: './raw-material-demands.component.html',
  styleUrls: ['./raw-material-demands.component.css'],
  providers: [ DataService, OrResultService, ToolsService ]
})
export class RawMaterialDemandsComponent implements OnInit {
  dataList: any[] = [];
  p: any;

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
        this.dataList = orResult.RawMaterialDemandsResult;
      }
    });
  }

}
