import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css'],
  providers: [ DataService ]
})
export class RawMaterialsComponent implements OnInit {
  dataList: any[] = [];
  public peityType:string = "bar";
  public peityOptions:any = { fill: ["#faa123"], width:100};

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getRawMaterials()
      .subscribe(res => {
        this.dataList = res;
      });
  }
}
