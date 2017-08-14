import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'
import {PurchasePlanService} from 'app/services/purchase-plan.service';
import {OrderDemandService} from 'app/services/order-demand.service';
import {ToolsService} from 'app/utils/tools.service';


import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Injectable()
export class ScheduleService {
  private HOST:string = HTTP_BASE;
  private runORURL = this.HOST + '/api/or/run';

  constructor(
    private http: Http,
    private purchasePlanService: PurchasePlanService,
    private orderDemandService: OrderDemandService,
    private toolsService: ToolsService
  ) { }

  runOR(): Observable<any>{
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){

      return this.http.post(this.runORURL, {
          id: JSON.parse(currentScenario)._id,
          numDays: this.toolsService.getScenarioDates
        }).map((_response: Response) => {
        const data = _response.json()
        return _response.json();
      });
    }
  }

  getAllScheduleData(): Observable<any>{
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){
      // return this.purchasePlanService.find({"scenario": JSON.parse(currentScenario)._id});
      let data$ = new Observable(observer => {
          Observable.forkJoin([
            this.purchasePlanService.find({"scenario": JSON.parse(currentScenario)._id}),
            this.orderDemandService.find({"scenario": JSON.parse(currentScenario)._id}),
          ]).subscribe(res => {
            let purchasePlanList = res[0].list;
            let orderDemandList = res[1].list;
            
            //raw material purchase
            let events: CalendarEvent[] = [];
            purchasePlanList.forEach(pp => {
              events.push({
                start: startOfDay(new Date(pp.date)),
                end: endOfDay(new Date(pp.date)),
                title: '原料采购: ' + pp.item.name + " 数量: " + pp.amount,
                color: colors.red,
                // actions: this.actions
              });
            })

            //order demands
            orderDemandList.forEach(od => {
              events.push({
                start: startOfDay(new Date(od.date)),
                end: endOfDay(new Date(od.date)),
                title: '订单计划: ' + od.item.name + " 数量: " + od.amount,
                color: colors.blue,
                // actions: this.actions
              });
            })
          
            observer.next({
              calenderEvents: events
            });
          })
      });
      return data$;
    }
  }

  // let kpi$ = new Observable(observer => {
  //       Observable.forkJoin([
  //         this.getLineKPI(),
  //         this.getStorageKPI(),
  //         this.getParameters()
  //       ]).subscribe(res => {
  //         let lineKPI = res[0];
  //         let storageKPI = res[1];
  //         let parameters = res[2];
  //         const totalDays = parameters["numDays"];
          
  //         observer.next({
  //           lineKPI: lineKPI,
  //           storageKPI: storageKPI,
  //           totalDays: totalDays
  //         })

  //       })
  //   });
  //   return kpi$;

}
