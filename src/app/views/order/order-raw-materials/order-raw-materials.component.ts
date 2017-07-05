import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-order-raw-materials',
  templateUrl: './order-raw-materials.component.html',
  styleUrls: ['./order-raw-materials.component.css'],
  providers: [ DataService ]
})
export class OrderRawMaterialsComponent implements OnInit {
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getOrderRawMaterials()
      .subscribe(res => {
        this.dataList = res;
      });
  }

}
