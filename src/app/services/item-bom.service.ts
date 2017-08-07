import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { GeneralService } from 'app/services/general.service';
import { RequestOptions } from 'app/model/request-options';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class ItemBOMService extends GeneralService{
  constructor(http: Http) { super(http); }

  public find(conditions: any){
    let requestOption = new RequestOptions({populateFields: "item materials.item"});
    return super.find("itemBOM", conditions, requestOption);
  }

  public save(obj: any){
    return super.save("itemBOM", obj);
  }

  public remove(obj: any){
    return super.remove("itemBOM", obj);
  }
  
}