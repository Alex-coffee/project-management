import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Process } from '../../../model/process';

@Component({
  selector: 'app-process',
  templateUrl: 'process.component.html',
  styleUrls: ['process.component.css'],
  providers: [ BackendService ]
})
export class ProcessComponent implements OnInit {
  errorMessage: string;
  processData: Process[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getProcessData();
  }

  getProcessData() {
    // this.backendService.getProcessData()
    //                  .subscribe(
    //                    processData => this.processData = processData,
    //                    error =>  this.errorMessage = <any>error);
  }

}
