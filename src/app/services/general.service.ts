import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import { RequestOptions } from 'app/model/request-options';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class GeneralService {
  private HOST:string = HTTP_BASE;

  private queryURL = this.HOST + '/api/find/model';
  private queryByIdURL = this.HOST + '/api/find/id/model';
  private saveURL = this.HOST + '/api/save/model';
  private batchInsertURL = this.HOST + '/api/batch/insert/model';
  private deleteURL = this.HOST + '/api/delete/model';

  constructor(private http: Http) { }

  protected findById(model: string, id: any): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('model', model);
    params.set('id', id);
    
    return this.http.get(this.queryByIdURL, {search: params}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

  protected find(model: string, conditions: any, options: RequestOptions): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('model', model);
    if(model != "scenario") {
      let currentScenario = localStorage.getItem('currentScenario');
      if(currentScenario){
        conditions.scenario = JSON.parse(currentScenario)._id;
      }
    }
    params.set('conditions', JSON.stringify(conditions));

    if(options){
      params.set('options', JSON.stringify(options));
    }

    return this.http.get(this.queryURL, {search: params}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

  protected save(model: string, content: any): Observable<any> {
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){
      content.scenario = JSON.parse(currentScenario)._id;
    }
    return this.http.post(this.saveURL, {model: model, content: content}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

  protected batchInsert(model: string, contentArray: any[]): Observable<any> {
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario && contentArray){
      contentArray.forEach(c => {
        c.scenario = JSON.parse(currentScenario)._id;
      })
    }
    return this.http.post(this.batchInsertURL, {model: model, content: contentArray}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

  protected remove(model: string, content: any): Observable<any> {
    return this.http.post(this.deleteURL, {model: model, content: content}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

}
