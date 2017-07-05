import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-product-static',
  templateUrl: './product-static.component.html',
  styleUrls: ['./product-static.component.css'],
  providers: [ DataService ]
})
export class ProductStaticComponent implements OnInit {
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getProductStatic()
      .subscribe(res => {
        this.dataList = res;
      });
  }
}
