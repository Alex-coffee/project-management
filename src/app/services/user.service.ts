import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { GeneralService } from 'app/services/general.service';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class UserService extends GeneralService{
  constructor(http: HttpClient) { super(http); }

  public find(conditions: any){
    return super.find("user", conditions, undefined);
  }

  public save(obj: any){
    return super.save("user", obj);
  }

  public remove(obj: any){
    return super.remove("user", obj);
  }

}