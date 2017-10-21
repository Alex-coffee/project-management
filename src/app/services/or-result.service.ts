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
export class OrResultService extends GeneralService {

  constructor(http: Http) { super(http); }
  
    public find(conditions: any){
      return super.find("orResult", conditions, undefined);
    }

    public getCurrentScenarioResult() {
      return super.find("orResult", {}, undefined);
    }

}
