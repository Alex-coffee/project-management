import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class MaterialService {
  private rawMaterialsDataUrl = 'assets/or/input/RawMaterials.json';
  private orderRawMaterialsDataUrl = 'assets/or/input/OrderRawMaterials.json';

  
  constructor (private http: Http) {}

  //*********** apis ****************/
  getRawMaterialData(): Observable<any[]> {
    return this.getFilesByUrl(this.rawMaterialsDataUrl);
  }

  getOrderRawMaterialData(): Observable<any[]> {
    return this.getFilesByUrl(this.orderRawMaterialsDataUrl);
  }

  //****************************** */
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
