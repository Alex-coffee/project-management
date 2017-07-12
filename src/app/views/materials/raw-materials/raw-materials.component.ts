import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'app/services/material.service';

@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css'],
  providers: [ MaterialService ]
})
export class RawMaterialsComponent implements OnInit {
  dataList: any[] = [];
  errorMessage: any;
  public peityType:string = "bar";
  public peityOptions:any = { fill: ["#faa123"], width:100};

  constructor(private materialService: MaterialService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.materialService.getRawMaterialData()
      .subscribe(res => {
        this.dataList = res;
      }, error => {
        this.errorMessage = <any>error;
      });
  }

}