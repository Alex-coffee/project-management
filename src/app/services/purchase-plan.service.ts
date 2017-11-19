import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { GeneralService } from 'app/services/general.service';
import { RequestOptions } from 'app/model/request-options';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class PurchasePlanService extends GeneralService{
  constructor(http: HttpClient) { super(http); }

  public find(conditions: any){
    let requestOption = new RequestOptions({populateFields: "item"});
    return super.find("purchasePlan", conditions, requestOption);
  }

  public save(obj: any){
    return super.save("purchasePlan", obj);
  }

  public batchInsert(obj: any){
    return super.batchInsert("purchasePlan", obj);
  }
  
  public remove(obj: any){
    return super.remove("purchasePlan", obj);
  }
  
}
