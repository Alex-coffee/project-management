import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as d3 from "d3";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/forkJoin'

import { GanttItem } from 'app/model/gantt-item';
import { GanttSlot } from 'app/model/gantt-slot';
import { GanttDataSet } from 'app/model/ganttDataSet';

@Injectable()
export class BackendService {
  private lineStaticDataUrl = 'assets/or/input/LineStaticData.json';
  private ordersUrl = 'assets/or/input/Orders.json';
  private productStaticDataUrl = 'assets/or/input/ProductStaticData.json';

  private productionScheduleUrl = 'assets/or/output/ProductionScheduleResult.json';
  private storageAmountUrl = 'assets/or/output/StorageAmountResult.json';
  private uncoveredDemandsUrl = 'assets/or/output/UncoveredDemands.json';
  
  constructor (private http: Http) {}

  //*********** apis ****************/
  getOrderData(): Observable<any[]> {
    return this.getFilesByUrl(this.ordersUrl);
  }

  getLineStaticData(): Observable<any[]> {
    return this.getFilesByUrl(this.lineStaticDataUrl);
  }

  getProductStaticData(): Observable<any[]> {
    return this.getFilesByUrl(this.productStaticDataUrl);
  }

  getProductionScheduleResult(): Observable<any[]> {
    return this.getFilesByUrl(this.productionScheduleUrl);
  }

  getStorageAmountResult(): Observable<any[]> {
    return this.getFilesByUrl(this.storageAmountUrl);
  }

  getUncoveredDemands(): Observable<any[]> {
    return this.getFilesByUrl(this.uncoveredDemandsUrl);
  }

  getGanttDataByType(type: string): Observable<GanttDataSet>{
    if("order" == type){
      return this.getOrderGanttData();
    }else{
      return this.getLineOrderGanttData();
    }
  }

  getOrderGanttData(): Observable<GanttDataSet>{
    let ganttData$ = new Observable(observer => {
      Observable.forkJoin([
        this.http.get(this.ordersUrl).map(res => res.json()),
        this.http.get(this.productionScheduleUrl).map(res => res.json())
        ]).subscribe(res => {
          let orders = res[0];
          let productionScheduleResult = res[1];
          let ganttItems: GanttItem[] = [], slots = [], ganttSlots: GanttSlot[] = [];;
          let i = 0;

          let today = new Date();
          today.setHours(0);
          today.setMinutes(0);
          today.setSeconds(0);
          today.setMilliseconds(0);
          let todayTime = today.getTime();

          orders.forEach(order => {
              slots.push(order.orderName)
              let slotItem = new GanttSlot({
                  id: i++,
                  label: order.orderName,
                  content: order
              });
              ganttSlots.push(slotItem);
          })

          i = 0;
          productionScheduleResult.forEach(productSchedule => {
              productSchedule.plan.forEach(p => {
                  let item = new GanttItem({
                      id: i++,
                      rowIndex: slots.indexOf(productSchedule.orderName),
                      startTime: todayTime + p.time * 24 * 3600 * 1000,
                      endTime: todayTime + (p.time + 1) * 24 * 3600 * 1000,
                      assignedSlot: productSchedule.orderName,
                      label: productSchedule.orderName,
                      content: p
                  });
                  ganttItems.push(item);
              })
          })

          const startTime = d3.min(ganttItems, function(d) { return d.startTime; })
          const endTime = d3.max(ganttItems, function(d) { return d.endTime; })
          
          observer.next(new GanttDataSet(ganttItems, ganttSlots, startTime, endTime));
      })

    })
    return ganttData$;
  }

  getLineOrderGanttData(): Observable<GanttDataSet>{
    let ganttData$ = new Observable(observer => {
      Observable.forkJoin([
        this.http.get(this.productStaticDataUrl).map(res => res.json()),
        this.http.get(this.productionScheduleUrl).map(res => res.json())
        ]).subscribe(res => {

          let productStaticData = res[0];
          let productionScheduleResult = res[1];
          let ganttItems: GanttItem[] = [], 
            slots = [1,2,3,4,5,6,7,8], 
            ganttSlots: GanttSlot[] = [],
            productStaticMap ={};
          let i = 0;

          let today = new Date();
          today.setHours(0);
          today.setMinutes(0);
          today.setSeconds(0);
          today.setMilliseconds(0);
          let todayTime = today.getTime();

          slots.forEach(slot => {
              let slotItem = new GanttSlot({
                  id: i++,
                  label: slot,
                  content: slot
              });
              ganttSlots.push(slotItem);
          })

          productStaticData.forEach(ps => {
              productStaticMap[ps.orderName] = ps;
          })

          i = 0;
          productionScheduleResult.forEach(productSchedule => {
              productSchedule.plan.forEach(p => {
                  p.produceTime = p.amount * productStaticMap[productSchedule.orderName].unitTime * 1000;
                  let item = new GanttItem({
                      id: i++,
                      rowIndex: slots.indexOf(p.line),
                      startTime: todayTime + p.time * 24 * 3600 * 1000,
                      assignedSlot: p.line,
                      label: productSchedule.orderName,
                      content: p,
                  });
                  ganttItems.push(item);
              })
          })

          this.processOrderInSameDay(ganttItems);

          const startTime = d3.min(ganttItems, function(d) { return d.startTime; })
          const endTime = d3.max(ganttItems, function(d) { return d.endTime; })
          
          observer.next(new GanttDataSet(ganttItems, ganttSlots, startTime, endTime));
      })

    })
    return ganttData$;
  }

  processOrderInSameDay(items){
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        let todayTime = today.getTime();

        let gapDuration = 2 * 3600 * 1000;
        var result = {}
        var orderProduceTimeMap = {};

        items.forEach(item => {
            if(!result[item.content.line]) result[item.content.line] = {};
            if(!result[item.content.line][item.content.time]) result[item.content.line][item.content.time] = [];

            if(result[item.content.line][item.content.time].length == 0){
                result[item.content.line][item.content.time].push({
                    startTime: item.startTime,
                    endTime: item.startTime + item.content.produceTime
                })

                orderProduceTimeMap[item.id] = {
                    startTime: item.startTime,
                    endTime: item.startTime + item.content.produceTime
                }
            }else{
                let startTime = result[item.content.line][item.content.time][result[item.content.line][item.content.time].length - 1].endTime + gapDuration;
                let endTime = startTime + item.content.produceTime;
                result[item.content.line][item.content.time].push({
                    startTime: startTime,
                    endTime: endTime
                })

                orderProduceTimeMap[item.id] = {
                    startTime: startTime,
                    endTime: endTime
                }
            }
        })

        items.forEach(item => {
            item.startTime = orderProduceTimeMap[item.id].startTime;
            item.endTime = orderProduceTimeMap[item.id].endTime;
        })
    }

  //****************************** */
  private getFilesByUrl(fileUrls: string){
    return this.http.get(fileUrls)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
