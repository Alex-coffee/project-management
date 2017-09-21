import { Injectable } from '@angular/core';

@Injectable()
export class ToolsService {

  constructor() { }

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

}
