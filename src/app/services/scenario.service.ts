import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { GeneralService } from 'app/services/general.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class ScenarioService extends GeneralService{
  constructor(http: HttpClient) { super(http); }

  public findCurrentScenarioData(): Observable<any>{
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){
      return super.findById("scenario", JSON.parse(currentScenario)._id);
    }
  }

  public find(conditions: any){
    return super.find("scenario", conditions, undefined);
  }

  public save(obj: any){
    return super.save("scenario", obj);
  }

  public remove(obj: any){
    return super.remove("scenario", obj);
  }
  
}
