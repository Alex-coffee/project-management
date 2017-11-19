import { Injectable } from '@angular/core';
import { HTTP_BASE } from 'app/config';
import { Response, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ToolsService {
  private HOST:string = HTTP_BASE;

  constructor(private http: HttpClient) { }

  exportORResult(){
    let currentScenarioStr = localStorage.getItem("currentScenario");
    let currentScenario = JSON.parse(currentScenarioStr);
    return this.http.post(this.HOST + '/api/data/result/generate', 
        {scenario: currentScenario, scenarioDates: this.getScenarioDates()}).toPromise();
  }

  getDateArrayByRange(startDate: Date, endDate: Date): Date[]{
    if(startDate && endDate && startDate.getTime() <= endDate.getTime()){
    let result = [];
    var dateIntevalTime = startDate.getTime()
    while(dateIntevalTime < endDate.getTime()){
        result.push(new Date(dateIntevalTime));
        dateIntevalTime += 24 * 3600 * 1000;
    }
    return result;
  }else
    return undefined;
  }

  getScenarioDates(){
    let currentScenarioStr = localStorage.getItem("currentScenario");
    if(currentScenarioStr){
      let currentScenario = JSON.parse(currentScenarioStr);
      const startDate = new Date(currentScenario.startDate);
      const endDate = new Date(currentScenario.endDate);
      endDate.setDate(endDate.getDate() + 1);
      return this.getDateArrayByRange(startDate, endDate);
    }else{
      return undefined;
    }
  }

  processImportedOrderData() {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('scenarioId', currentScenario._id);
    return this.http.post(this.HOST + '/api/data/orderprocess', params).toPromise();
  }

  processImportedProductStaticData() {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    const params: URLSearchParams = new URLSearchParams();
    params.set('scenarioId', currentScenario._id);
    return this.http.post(this.HOST + '/api/data/productstatic', params).toPromise();
  }

}
