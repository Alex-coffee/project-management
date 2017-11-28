import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ItemService } from 'app/services/item.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-demands-meet-view',
  templateUrl: './demands-meet-view.component.html',
  styleUrls: ['./demands-meet-view.component.css'],
  providers: [ DataService, OrResultService, ItemService, ToolsService ]
})
export class DemandsMeetViewComponent implements OnInit {
  dataList: any[] = [];
  demandsMeetViewList: any[] = [];
  scenarioDates: any[] = [];
  
  constructor(
    private dataService: DataService,
    private orResultService: OrResultService,
    private itemService: ItemService,
    private toolsService: ToolsService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){

    this.orResultService.getCurrentScenarioResult().subscribe(res => {
        if(res.list.length > 0){
          var orResult = res.list[0];
          this.demandsMeetViewList = orResult.DemandsMeetView;
          let itemIds = [];
          this.demandsMeetViewList.forEach(item => {
            itemIds.push(item._id);
          });

          this.itemService.find({"_id": {$in: itemIds}}).subscribe(result => {
            let itemList = result.list;
            this.scenarioDates  = this.toolsService.getScenarioDates();

            itemList.forEach(product => {
              let rowData = {};
              rowData['name'] = product.name;
              rowData['desc'] = product.desc;
              rowData['demandsMeets'] = [];
              let relatedList = this.demandsMeetViewList.filter(dmv => dmv.orderName === product.name);
              relatedList.sort((a, b) => a.time - b.time);
              for(let i = 0; i < this.scenarioDates.length; i++){
                let demandsMeetView = relatedList.find(r => r.time === i);
                rowData['demandsMeets'].push(demandsMeetView ? demandsMeetView.amount : 0);
              }
              this.dataList.push(rowData);
            })

            console.log(this.dataList);
          });

        }
      });
  }
}
