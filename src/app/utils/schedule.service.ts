import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HTTP_BASE } from 'app/config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'
import {PurchasePlanService} from 'app/services/purchase-plan.service';
import {OrderDemandService} from 'app/services/order-demand.service';
import {ProductionPlanService} from 'app/services/production-plan.service';
import {ToolsService} from 'app/utils/tools.service';
import { ItemService } from 'app/services/item.service';

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
    private http: HttpClient,
    private purchasePlanService: PurchasePlanService,
    private orderDemandService: OrderDemandService,
    private productionPlanService: ProductionPlanService,
    private itemService: ItemService,
    private toolsService: ToolsService
  ) { }

  runOR(): Observable<any>{
    const currentScenario = localStorage.getItem('currentScenario');
    const currentUser = sessionStorage.getItem('currentUser');
    if(currentScenario && currentUser){

      return this.http.post(this.runORURL, {
          id: JSON.parse(currentScenario)._id,
          company: JSON.parse(currentUser).company,
          numDays: this.toolsService.getScenarioDates
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
                meta: pp,
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
                meta: od,
                start: startOfDay(new Date(od.date)),
                end: endOfDay(new Date(od.date)),
                title: '产品计划: ' + od.item.name + " 数量: " + od.amount,
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

  getOrderSchedulePlanData(productIds: any): Observable<any>{
    const currentScenario = localStorage.getItem('currentScenario');
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentScenario && currentUser) {

      let itemSearchCondition, orderDemandSearchCondition;
      if (productIds) {
        itemSearchCondition = {"_id": { $in: productIds }, 'company': JSON.parse(currentUser).company};
        orderDemandSearchCondition = {"item": { $in: productIds }, 'scenario': JSON.parse(currentScenario)._id};
      }else{
        itemSearchCondition = {'company': JSON.parse(currentUser).company};
        orderDemandSearchCondition = {'scenario': JSON.parse(currentScenario)._id};
      }
      const data$ = new Observable(observer => {
        Observable.forkJoin([
          this.itemService.findProduct(itemSearchCondition),
          this.orderDemandService.find(orderDemandSearchCondition)
        ]).subscribe(res => {
            const orderList = res[0].list;
            const orderDemandList = res[1].list;
            const currentScenarioObj = JSON.parse(currentScenario);
            const dateRanges = this.toolsService.getDateArrayByRange(new Date(currentScenarioObj.startDate), 
              new Date(currentScenarioObj.endDate));

            let orderScheduleList = [];
            orderList.forEach(order => {
              const scheduleArray = [];
              dateRanges.forEach(date => {
                const schedule = orderDemandList.find(od => {
                  return od.item._id === order._id && new Date(od.date).getTime() === date.getTime();
                });
                if(schedule)  scheduleArray.push(schedule);
              });

              const orderSchedule = {
                order: order,
                scheduleArray: scheduleArray
              };
              orderScheduleList.push(orderSchedule);
            });

            observer.next({
              orderList: orderList,
              orderDemandList: orderDemandList,
              orderScheduleList: orderScheduleList
            });
          });
      });
      return data$;
    }
  }

  getOrderScheduleProductionPlanData(productIds: any): Observable<any>{
    const currentScenario = localStorage.getItem('currentScenario');
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentScenario && currentUser) {

      let itemSearchCondition, productionPlanSearchCondition;
      if (productIds) {
        itemSearchCondition = {"_id": { $in: productIds }, 'company': JSON.parse(currentUser).company};
        productionPlanSearchCondition = {"item": { $in: productIds }, 'company': JSON.parse(currentUser).company};
      }else{
        itemSearchCondition = {'company': JSON.parse(currentUser).company};
        productionPlanSearchCondition = {'company': JSON.parse(currentUser).company};
      }
      const data$ = new Observable(observer => {
        Observable.forkJoin([
          this.itemService.findProduct(itemSearchCondition),
          this.productionPlanService.find(productionPlanSearchCondition)
        ]).subscribe(res => {
            const orderList = res[0].list;
            const productionPlanList = res[1].list;
            const currentScenarioObj = JSON.parse(currentScenario);
            const dateRanges = this.toolsService.getDateArrayByRange(new Date(currentScenarioObj.startDate), 
              new Date(currentScenarioObj.endDate));

            let productionScheduleList = [];
            orderList.forEach(order => {
              const scheduleArray = [];
              dateRanges.forEach(date => {
                const schedule = productionPlanList.find(od => {
                  return od.item._id === order._id && new Date(od.date).getTime() === date.getTime();
                });
                if(schedule) {
                  scheduleArray.push(schedule)
                };
              });

              if(scheduleArray.length > 0){
                const orderSchedule = {
                  order: order,
                  scheduleArray: scheduleArray
                };
                productionScheduleList.push(orderSchedule);
              }
            });

            observer.next({
              orderList: orderList,
              productionPlanList: productionPlanList,
              productionScheduleList: productionScheduleList
            });
          });
      });
      return data$;
    }
  }

  getPurchasePlanData(): Observable<any>{
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){
      // return this.purchasePlanService.find({"scenario": JSON.parse(currentScenario)._id});
      let data$ = new Observable(observer => {
        this.orderDemandService.find({"scenario": JSON.parse(currentScenario)._id})
        .subscribe(res => {
            let orderDemandList = res.list;
            
            //raw material purchase
            let events: CalendarEvent[] = [];
            orderDemandList.forEach(od => {
              events.push({
                meta: od,
                start: startOfDay(new Date(od.date)),
                end: endOfDay(new Date(od.date)),
                title: '产品计划: ' + od.item.name + " 数量: " + od.amount,
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

  getOrderDemandData(): Observable<any>{
    let currentScenario = localStorage.getItem('currentScenario');
    if(currentScenario){
      // return this.purchasePlanService.find({"scenario": JSON.parse(currentScenario)._id});
      let data$ = new Observable(observer => {
        this.purchasePlanService.find({"scenario": JSON.parse(currentScenario)._id})
        .subscribe(res => {
            let purchasePlanList = res.list;
            
            //raw material purchase
            let events: CalendarEvent[] = [];
            purchasePlanList.forEach(pp => {
              events.push({
                meta: pp,
                start: startOfDay(new Date(pp.date)),
                end: endOfDay(new Date(pp.date)),
                title: '原料采购: ' + pp.item.name + " 数量: " + pp.amount,
                color: colors.red,
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
