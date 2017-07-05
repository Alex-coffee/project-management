import { Component, OnInit } from '@angular/core';
import { DataService } from 'app/services/data.service';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [ DataService ]
})
export class ParametersComponent implements OnInit {
  parameters: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.dataService.getParameters()
      .subscribe(res => {
        this.parameters = res;
      });
  }

}
