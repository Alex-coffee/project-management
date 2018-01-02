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
    while(dateIntevalTime <= endDate.getTime()){
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

  processScenarioData(fileName: string) {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return this.http.post(this.HOST + '/api/data/scenario/process', 
      {
        'filename': fileName,
        'company': currentUser.company,
        'scenarioId': currentScenario._id,
        'scenario': currentScenario
      }).toPromise();
  }

  processCompanyData(fileName: string) {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    return this.http.post(this.HOST + '/api/data/company/process', 
      {
        'filename': fileName,
        'company': currentUser.company
      }).toPromise();
  }

  processImportedOrderData() {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    return this.http.post(this.HOST + '/api/data/orderprocess', {'scenarioId': currentScenario._id}).toPromise();
  }

  processImportedProductStaticData() {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    return this.http.post(this.HOST + '/api/data/productstatic', {'scenarioId': currentScenario._id}).toPromise();
  }

  processImportedLineData() {
    const currentScenario = JSON.parse(localStorage.getItem('currentScenario'));
    return this.http.post(this.HOST + '/api/data/lineprocess', {'scenarioId': currentScenario._id}).toPromise();
  }
}
