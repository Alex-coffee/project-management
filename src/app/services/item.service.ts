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
export class ItemService extends GeneralService{
  constructor(http: Http) { super(http); }

  public find(conditions: any){
    return super.find('item', conditions, undefined);
  }

  public findRawMaterial(conditions: any){
    if(conditions) conditions.type = 'material';
    return super.find('item', conditions, undefined);
  }

  public findProduct(conditions: any) {
    if (conditions) conditions.type = 'product';
    return super.find('item', conditions, undefined);
  }

  public saveRawMaterial(obj: any) {
    if (obj) obj.type = 'material';
    return super.save('item', obj);
  }

  public saveProduct(obj: any) {
    if(obj) obj.type = 'product';
    return super.save('item', obj);
  }

  public remove(obj: any) {
    return super.remove('item', obj);
  }

}
