import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { RequestOptions } from 'app/model/request-options';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'
import { Conditional } from '@angular/compiler';

@Injectable()
export class GeneralService {
  private HOST:string = HTTP_BASE;

  private queryURL = this.HOST + '/api/find/model';
  private queryByIdURL = this.HOST + '/api/find/id/model';
  private saveURL = this.HOST + '/api/save/model';
  private batchInsertURL = this.HOST + '/api/batch/insert/model';
  private deleteURL = this.HOST + '/api/delete/model';
  private deleteByCondition = this.HOST + '/api/delete/model/condition';

  constructor(private http: HttpClient) { }

  protected findById(model: string, id: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('model', model);
    httpParams = httpParams.append('id', id);
    return this.http.get(this.queryByIdURL, {params: httpParams});
  }

  protected find(model: any, conditions: any, options: RequestOptions): Observable<any> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('model', model);

    if ( model === 'item' || model === 'line' || model === 'itemBOM' ){
      const currentUser = sessionStorage.getItem('currentUser');
      if (currentUser) {
        conditions.company = JSON.parse(currentUser).company;
      }
    } else if ( model !== 'scenario' && model !== 'user' && model !== 'company') {
      const currentScenario = localStorage.getItem('currentScenario');
      if (currentScenario) {
        conditions.scenario = JSON.parse(currentScenario)._id;
      }
    }
    
    httpParams = httpParams.append('conditions', JSON.stringify(conditions));

    if (options) {
      httpParams = httpParams.append('options', JSON.stringify(options));
    }

    return this.http.get(this.queryURL,  {params: httpParams});
  }

  protected save(model: string, content: any): Observable<any> {
    const currentScenario = localStorage.getItem('currentScenario');
    if (currentScenario) {
      content.scenario = JSON.parse(currentScenario)._id;
    }
    return this.http.post(this.saveURL, {model: model, content: content});
  }

  protected batchInsert(model: string, contentArray: any[]): Observable<any> {
    const currentScenario = localStorage.getItem('currentScenario');
    if (currentScenario && contentArray) {
      contentArray.forEach(c => {
        c.scenario = JSON.parse(currentScenario)._id;
      });
    }
    return this.http.post(this.batchInsertURL, {model: model, content: contentArray});
  }

  protected remove(model: string, content: any): Observable<any> {
    return this.http.post(this.deleteURL, {model: model, content: content});
  }

  protected clearDataByScenario(model: string): Observable<any> {
    const currentScenario = localStorage.getItem('currentScenario');
    let content = {};
    if (currentScenario) {
      content["scenario"] = JSON.parse(currentScenario)._id;
    }
    return this.http.post(this.deleteByCondition, {model: model, condition: content});
  }
}
