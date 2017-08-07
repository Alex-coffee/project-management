import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { GeneralService } from 'app/services/general.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class DemandService extends GeneralService{
  constructor(http: Http) { super(http); }

  public find(conditions: any){
    return super.find("demand", conditions, undefined);
  }

  public save(obj: any){
    return super.save("demand", obj);
  }

  public remove(obj: any){
    return super.remove("demand", obj);
  }
  
}