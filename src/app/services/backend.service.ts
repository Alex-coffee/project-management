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

import { ScenarioService } from 'app/services/scenario.service';
import { LineService } from 'app/services/line.service';


@Injectable()
export class BackendService {
  private lineStaticDataUrl = this.getInputPath() + 'LineStaticData.json';
  private ordersUrl = this.getInputPath() + 'Orders.json';
  private productStaticDataUrl = this.getInputPath() + 'ProductStaticData.json';

  private productionScheduleUrl = this.getOutputPath() + 'ProductionScheduleResult.json';
  private storageAmountUrl = this.getOutputPath() + 'StorageAmountResult.json';
  private uncoveredDemandsUrl = this.getOutputPath() + 'UncoveredDemands.json';
  
  constructor (
    private http: Http,
    private scenarioService: ScenarioService,
    private lineService: LineService
  ) {}

  getInputPath(): string {
    let currentScenarioStr = localStorage.getItem("currentScenario");
    if(currentScenarioStr){
      let currentScenario = JSON.parse(currentScenarioStr);
      return 'assets/or/temp/' + currentScenario._id + '/';
    }
    return 'assets/or/temp/';
  }

  getOutputPath(): string {
    let currentScenarioStr = localStorage.getItem("currentScenario");
    if(currentScenarioStr){
      let currentScenario = JSON.parse(currentScenarioStr);
      return 'assets/or/output/' + currentScenario._id + '/';
    }
    return 'assets/or/output/';
  }

  //*********** apis ****************/
  getOrderData(): Observable<any[]> {
    return this.getFilesByUrl(this.getInputPath() + 'Orders.json');
  }

  getLineStaticData(): Observable<any[]> {
    return this.getFilesByUrl(this.getInputPath() + 'LineStaticData.json');
  }

  getProductStaticData(): Observable<any[]> {
    return this.getFilesByUrl(this.getInputPath() + 'ProductStaticData.json');
  }

  getProductionScheduleResult(): Observable<any[]> {
    return this.getFilesByUrl(this.getOutputPath() + 'ProductionScheduleResult.json');
  }

  getStorageAmountResult(): Observable<any[]> {
    return this.getFilesByUrl(this.getOutputPath() + 'StorageAmountResult.json');
  }

  getUncoveredDemands(): Observable<any[]> {
    return this.getFilesByUrl(this.getOutputPath() + 'UncoveredDemands.json');
  }

  getGanttDataByType(type: string): Observable<GanttDataSet>{
    if("order" == type){
      return this.getOrderGanttData();
    }else{
      return this.getLineOrderGanttData();
    }
  }

  getOrderGanttData(): Observable<GanttDataSet>{
    let ganttData$ = new Observable<GanttDataSet>(observer => {
      Observable.forkJoin([
        this.http.get(this.ordersUrl).map(res => res.json()),
        this.http.get(this.productionScheduleUrl).map(res => res.json()),
        this.scenarioService.findCurrentScenarioData(),
        this.http.get(this.lineStaticDataUrl).map(res => res.json()),
        ]).subscribe(res => {
          let orders = res[0];
          let productionScheduleResult = res[1];
          const scenarioData = res[2];
          const lineStaticData = res[3];
          let ganttItems: GanttItem[] = [], slots = [], ganttSlots: GanttSlot[] = [];;
          let i = 0;

          orders.forEach(order => {
              slots.push(order.orderName)
              const slotItem = new GanttSlot({
                  id: i++,
                  label: order.orderName,
                  content: order
              });
              ganttSlots.push(slotItem);
          })

          i = 0;
          productionScheduleResult.forEach(productSchedule => {
              productSchedule.plan.forEach(p => {
                let lineStaticObj = lineStaticData.find(lineStatic => lineStatic.lineId == p.line);
                  const item = new GanttItem({
                      id: i++,
                      rowIndex: slots.indexOf(productSchedule.orderName),
                      startTime: new Date(scenarioData.startDate).getTime() + p.time * 24 * 3600 * 1000,
                      endTime: new Date(scenarioData.startDate).getTime() + (p.time + 1) * 24 * 3600 * 1000,
                      assignedSlot: productSchedule.orderName,
                      label: productSchedule.orderName,
                      content: p,
                      metaData: lineStaticObj
                  });
                  ganttItems.push(item);
              })
          })

          const startTime = new Date(scenarioData.startDate).getTime();
          const endTime = new Date(scenarioData.endDate).getTime();
          
          observer.next(new GanttDataSet(ganttItems, ganttSlots, startTime, endTime));
      })

    })
    return ganttData$;
  }

  getLineOrderGanttData(): Observable<GanttDataSet>{
    let ganttData$ = new Observable<GanttDataSet>(observer => {
      Observable.forkJoin([
        this.http.get(this.productStaticDataUrl).map(res => res.json()),
        this.http.get(this.productionScheduleUrl).map(res => res.json()),
        this.lineService.find({}),
        this.scenarioService.findCurrentScenarioData(),
        this.http.get(this.lineStaticDataUrl).map(res => res.json()),
        ]).subscribe(res => {
          let productStaticData = res[0];
          let productionScheduleResult = res[1];
          let lines = res[2].list;
          const scenarioData = res[3];
          const lineStaticData = res[4];

          let ganttItems: GanttItem[] = [],
            ganttSlots: GanttSlot[] = [],
            productStaticMap ={};
          let i = 0;

          lines.forEach(line => {
              const slotItem = new GanttSlot({
                  id: line._id,
                  label: line.name,
                  content: line
              });
              ganttSlots.push(slotItem);
          });

          productStaticData.forEach(ps => {
              productStaticMap[ps.orderName] = ps;
          });

          i = 0;
          productionScheduleResult.forEach(productSchedule => {
              productSchedule.plan.forEach(p => {
                  p.produceTime = p.amount * productStaticMap[productSchedule.orderName].unitTime * 1000;
                  let lineStaticObj = lineStaticData.find(lineStatic => lineStatic.lineId == p.line);
                  const item = new GanttItem({
                      id: i++,
                      rowIndex: lines.findIndex(line => line._id === p.line),
                      startTime: new Date(scenarioData.startDate).getTime() + p.time * 24 * 3600 * 1000,
                      assignedSlot: p.line,
                      label: productSchedule.orderName,
                      content: p,
                      metaData: lineStaticObj
                  });
                  ganttItems.push(item);
              })
          })

          this.processOrderInSameDay(ganttItems);

          const startTime = new Date(scenarioData.startDate).getTime();
          const endTime = new Date(scenarioData.endDate).getTime();
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
                const startTime = result[item.content.line][item.content.time][result[item.content.line][item.content.time].length - 1].endTime + gapDuration;
                const endTime = startTime + item.content.produceTime;
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
    const body = res.json();
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
