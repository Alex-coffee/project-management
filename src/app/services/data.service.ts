import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class DataService {
  //schedule
  private rawMaterialDemandsResultUrl = 'assets/or/output/RawMaterialDemandsResult.json';
  private storageAmountResultUrl = 'assets/or/output/StorageAmountResult.json';
  private uncoveredDemandsUrl = 'assets/or/output/UncoveredDemands.json';
  //order
  private ordersUrl = 'assets/or/input/Orders.json';
  private orderRawMaterialsUrl = 'assets/or/input/OrderRawMaterials.json';
  private productStaticDataUrl = 'assets/or/input/ProductStaticData.json';
  //basic
  private rawMaterialsUrl = 'assets/or/input/RawMaterials.json';
  private lineStaticDataUrl = 'assets/or/input/LineStaticData.json';
  private parametersUrl = 'assets/or/input/Parameters.json';

  constructor(private http: Http) { }

  getRawMaterialDemandsResult(): Observable<any[]> {
    return this.getFilesByUrl(this.rawMaterialDemandsResultUrl);
  }

  getStorageAmountResult(): Observable<any[]> {
    return this.getFilesByUrl(this.storageAmountResultUrl);
  }

  getUncoveredDemands(): Observable<any[]> {
    return this.getFilesByUrl(this.uncoveredDemandsUrl);
  }

  getOrders(): Observable<any[]> {
    return this.getFilesByUrl(this.ordersUrl);
  }

  getOrderRawMaterials(): Observable<any[]> {
    return this.getFilesByUrl(this.orderRawMaterialsUrl);
  }

  getProductStatic(): Observable<any[]> {
    return this.getFilesByUrl(this.productStaticDataUrl);
  }

  getRawMaterials(): Observable<any[]> {
    return this.getFilesByUrl(this.rawMaterialsUrl);
  }

  getLineStatic(): Observable<any[]> {
    return this.getFilesByUrl(this.lineStaticDataUrl);
  }

  getParameters(): Observable<any[]> {
    return this.getFilesByUrl(this.parametersUrl);
  }

  //************** private methods ***************
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
