import { Component, OnInit } from '@angular/core';
import { BackendService } from 'app/services/backend.service';

@Component({
  selector: 'app-line-static',
  templateUrl: './line-static.component.html',
  styleUrls: ['./line-static.component.css'],
  providers: [ BackendService ]
})
export class LineStaticComponent implements OnInit {
  private dataList: any[] = [];
  errorMessage: string;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.backendService.getLineStaticData()
                     .subscribe(
                       orderData => this.dataList = orderData,
                       error =>  this.errorMessage = <any>error);
  }

}
