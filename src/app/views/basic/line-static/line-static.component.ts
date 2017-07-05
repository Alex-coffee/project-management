import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-line-static',
  templateUrl: './line-static.component.html',
  styleUrls: ['./line-static.component.css'],
  providers: [ DataService ]
})
export class LineStaticComponent implements OnInit {
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getLineStatic()
      .subscribe(res => {
        this.dataList = res;
      });
  }

}
