import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'app/services/material.service';

@Component({
  selector: 'app-order-raw-materials',
  templateUrl: './order-raw-materials.component.html',
  styleUrls: ['./order-raw-materials.component.css'],
  providers: [ MaterialService ]
})
export class OrderRawMaterialsComponent implements OnInit {
dataList: any[] = [];
  errorMessage: any;

  constructor(private materialService: MaterialService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.materialService.getOrderRawMaterialData()
      .subscribe(res => {
        this.dataList = res;
      }, error => {
        this.errorMessage = <any>error;
      });
  }
}
