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
export class LineService extends GeneralService{
  constructor(http: Http) { super(http); }

  public find(conditions: any){
    return super.find("line", conditions, undefined);
  }

  public save(obj: any){
    return super.save("line", obj);
  }

  public remove(obj: any){
    return super.remove("line", obj);
  }
  
}
