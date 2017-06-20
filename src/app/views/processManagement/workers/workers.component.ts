import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Worker } from '../../../model/worker';

@Component({
  selector: 'app-workers',
  templateUrl: 'workers.component.html',
  styleUrls: ['workers.component.css'],
  providers: [ BackendService ]
})
export class WorkersComponent implements OnInit {
  errorMessage: string;
  workerData: Worker[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getWorkerData()
  }

  getWorkerData() {
    this.backendService.getWorkerData()
                     .subscribe(
                       workerData => this.workerData = workerData,
                       error =>  this.errorMessage = <any>error);
  }

}
