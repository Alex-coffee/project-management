import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { ProcessResult } from '../../../model/process-result';
import { Process } from '../../../model/process';

@Component({
  selector: 'app-process-result',
  templateUrl: 'process-result.component.html',
  styleUrls: ['process-result.component.css'],
  providers: [ BackendService ]
})
export class ProcessResultComponent implements OnInit {
  errorMessage: string;
  processResultData: ProcessResult[] = [];
  processData: any[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getProcessResultData();
    this.getProcessData();
  }

  getProcessResultData() {
    this.backendService.getProcessResultData()
                     .subscribe(
                       processResultData => this.processResultData = processResultData,
                       error =>  this.errorMessage = <any>error);
  }

  getProcessData() {
    this.backendService.getProcessData()
                     .subscribe(
                       processData => this.processData = processData,
                       error =>  this.errorMessage = <any>error);
  }
}
