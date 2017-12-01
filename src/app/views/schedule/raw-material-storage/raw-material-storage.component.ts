import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { OrResultService } from 'app/services/or-result.service';
import { ItemService } from 'app/services/item.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-raw-material-storage',
  templateUrl: './raw-material-storage.component.html',
  styleUrls: ['./raw-material-storage.component.css'],
  providers: [ DataService, OrResultService, ItemService, ToolsService ]
})
export class RawMaterialStorageComponent implements OnInit {
  dataList: any[] = [];
  rawMaterialStorageList: any[] = [];
  scenarioDates: any[] = [];
  p: any;
  
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
          this.rawMaterialStorageList = orResult.RawMaterialStorage;
          let itemIds = [];
          this.rawMaterialStorageList.forEach(item => {
            itemIds.push(item._id);
          });

          this.itemService.find({"_id": {$in: itemIds}}).subscribe(result => {
            let itemList = result.list;
            this.scenarioDates  = this.toolsService.getScenarioDates();

            itemList.forEach(product => {
              let rowData = {};
              rowData['name'] = product.name;
              rowData['desc'] = product.desc;
              rowData['rawMaterialStorages'] = [];
              let relatedList = this.rawMaterialStorageList.filter(rms => rms.rawName === product.name);
              relatedList.sort((a, b) => a.time - b.time);
              for(let i = 0; i < this.scenarioDates.length; i++){
                let rawMaterialStorage = relatedList.find(r => r.time === i);
                rowData['rawMaterialStorages'].push(rawMaterialStorage ? rawMaterialStorage.amount : 0);
              }
              this.dataList.push(rowData);
            })

            console.log(this.dataList);
          });

        }
      });
  }

}
