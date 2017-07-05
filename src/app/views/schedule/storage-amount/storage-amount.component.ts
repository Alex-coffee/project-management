import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-storage-amount',
  templateUrl: './storage-amount.component.html',
  styleUrls: ['./storage-amount.component.css'],
  providers: [ DataService ]
})
export class StorageAmountComponent implements OnInit {
  dataList: any[] = [];
  public peityType:string = "bar";
  public peityOptions:any = { fill: ["#faa123"], width:100};

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getStorageAmountResult()
      .subscribe(res => {
        this.dataList = res;
      });
  }

}
