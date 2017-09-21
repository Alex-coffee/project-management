import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-raw-material-demands',
  templateUrl: './raw-material-demands.component.html',
  styleUrls: ['./raw-material-demands.component.css'],
  providers: [ DataService ]
})
export class RawMaterialDemandsComponent implements OnInit {
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    // this.dataService.getRawMaterialDemandsResult()
    //   .subscribe(res => {
    //     this.dataList = res;
    //   });
  }

}
