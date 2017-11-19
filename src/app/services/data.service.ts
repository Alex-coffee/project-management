import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class DataService {
  private HOST:string = HTTP_BASE;
  // private HOST:string = "http://localhost:8001";
  //schedule
  private rawMaterialDemandsResultUrl = 'assets/or/output/RawMaterialDemandsResult.json';
  private storageAmountResultUrl = 'assets/or/output/StorageAmountResult.json';
  private uncoveredDemandsUrl = 'assets/or/output/UncoveredDemands.json';
  private lineKPIUrl = 'assets/or/output/LineKPIs.json';
  private storageKPIUrl = 'assets/or/output/storageKPIs.json';

  //order
  private ordersUrl = 'assets/or/input/Orders.json';
  private orderRawMaterialsUrl = 'assets/or/input/OrderRawMaterials.json';
  private productStaticDataUrl = 'assets/or/input/ProductStaticData.json';
  //basic
  private rawMaterialsUrl = 'assets/or/input/RawMaterials.json';
  private lineStaticDataUrl = 'assets/or/input/LineStaticData.json';
  private parametersUrl = 'assets/or/input/Parameters.json';

  constructor(private http: HttpClient) { }

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

  getParameters(): Observable<any> {
    return this.getFilesByUrl(this.parametersUrl);
  }

  getLineKPI(): Observable<any[]> {
    return this.getFilesByUrl(this.lineKPIUrl);
  }

  getStorageKPI(): Observable<any[]> {
    return this.getFilesByUrl(this.storageKPIUrl);
  }

  saveLineStaticData(content): Observable<any> {
    return this.saveFile(this.lineStaticDataUrl, content);
  }

  saveRawMaterialData(content): Observable<any> {
    return this.saveFile(this.rawMaterialsUrl, content);
  }

  saveParameters(content): Observable<any> {
    return this.saveFile(this.parametersUrl, content);
  }

  saveProductStaticData(content): Observable<any> {
    return this.saveFile(this.productStaticDataUrl, content);
  }

  saveOrderData(content): Observable<any> {
    return this.saveFile(this.ordersUrl, content);
  }

  saveOrderRawMaterials(content): Observable<any> {
    return this.saveFile(this.orderRawMaterialsUrl, content);
  }

  getKPI(): Observable<any> {
    let kpi$ = new Observable(observer => {
        Observable.forkJoin([
          this.getLineKPI(),
          this.getStorageKPI(),
          this.getParameters()
        ]).subscribe(res => {
          let lineKPI = res[0];
          let storageKPI = res[1];
          let parameters = res[2];
          const totalDays = parameters["numDays"];
          
          observer.next({
            lineKPI: lineKPI,
            storageKPI: storageKPI,
            totalDays: totalDays
          })

        })
    });
    return kpi$;
  }

  getMaterialPurchaseData(): Observable<any> {
    let materialPurchase$ = new Observable(observer => {
        Observable.forkJoin([
          this.getRawMaterials(),
          this.getParameters()
        ]).subscribe(res => {
          let rawMaterials = res[0];
          let parameters = res[1];
          const totalDays = parameters["numDays"];
          
          observer.next({
            rawMaterials: rawMaterials,
            totalDays: totalDays
          })

        })
    });
    return materialPurchase$;
  }

  processSupplyFormData(rawMaterials:any[], totalDays: number): any{
    let rawMaterialsMap = {};
          let rawHeader = ['原料'];
          let supplyRows = [];
          rawMaterials.forEach(rm => {
            rawMaterialsMap[rm.rawId] = rm;
            rawHeader.push(rm.rawName);
          })
          for(let i = 0; i < totalDays; i++){
            let rowData = ["Day " + i];
            for(let j = 0; j < rawMaterials.length; j++){
              rowData.push(rawMaterials[j].supplys[i]);
            }
            supplyRows.push(rowData);
          }
    return {
      header: rawHeader,
      rows: supplyRows
    }
  }

  //************** private methods ***************
  private saveFile(fileUrl, content){
    return this.http.post(this.HOST + "/api/saveJSON", {fileUrl: fileUrl, content: content});
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
