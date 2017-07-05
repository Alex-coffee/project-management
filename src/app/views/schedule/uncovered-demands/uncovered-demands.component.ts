import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-uncovered-demands',
  templateUrl: './uncovered-demands.component.html',
  styleUrls: ['./uncovered-demands.component.css'],
  providers: [ DataService ]
})
export class UncoveredDemandsComponent implements OnInit {
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getUncoveredDemands()
      .subscribe(res => {
        this.dataList = res;
      });
  }

}
