import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Process } from '../model/process';
import { RawMaterial } from '../model/raw-material';
import { Worker } from '../model/worker';
import { Order } from '../model/order';
import { ProcessResult } from '../model/process-result';

@Injectable()
export class BackendService {
  private processUrl = 'assets/data/ProcessVec.json';
  private ordersUrl = 'assets/data/Orders.json';
  private processResultUrl = 'assets/data/ProcessResults.json';
  private rawMaterialsUrl = 'assets/data/RawMaterials.json';
  private workersUrl = 'assets/data/Workers.json';

  constructor (private http: Http) {}

  getProcessData(): Observable<Process[]> {
    return this.getFilesByUrl(this.processUrl);
  }

  getRawMaterialData(): Observable<RawMaterial[]> {
    return this.getFilesByUrl(this.rawMaterialsUrl);
  }

  getOrderData(): Observable<Order[]> {
    return this.getFilesByUrl(this.ordersUrl);
  }

  getProcessResultData(): Observable<ProcessResult[]> {
    return this.getFilesByUrl(this.processResultUrl);
  }

  getWorkerData(): Observable<Worker[]> {
    return this.getFilesByUrl(this.workersUrl);
  }

  private getFilesByUrl(fileUrls: string){
    return this.http.get(fileUrls)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
