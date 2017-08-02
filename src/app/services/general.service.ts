import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

@Injectable()
export class GeneralService {
  private HOST:string = HTTP_BASE;

  private queryURL = this.HOST + '/api/find/model';
  private saveURL = this.HOST + '/api/save/model';
  private deleteURL = this.HOST + '/api/delete/model';

  constructor(private http: Http) { }

  protected find(model: string, conditions: any): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('model', model);
    params.set('conditions', JSON.stringify(conditions));
    return this.http.get(this.queryURL, {search: params}).map((_response: Response) => {
      const data = _response.json()
      return _response.json();
    });
  }

  protected save(model: string, content: any): Observable<any> {
    return this.http.post(this.saveURL, {model: model, content: content}).map((_response: Response) => {
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
