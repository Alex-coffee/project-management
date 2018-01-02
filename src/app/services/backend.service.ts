import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
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
import { OrResultService } from 'app/services/or-result.service';
import { OrInputService } from 'app/services/or-input.service';


@Injectable()
export class BackendService {
  
  constructor (
    private http: HttpClient,
    private scenarioService: ScenarioService,
    private lineService: LineService,
    private orResultService: OrResultService,
    private orInputService: OrInputService
  ) {}

  //*********** apis ****************/

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
        this.orResultService.getCurrentScenarioResult(),
        this.orInputService.getCurrentScenarioInput(),
        this.scenarioService.findCurrentScenarioData()
        ]).subscribe(res => {
          let orders = [];
          let productionScheduleResult = [];
          let lineStaticData =[];
          if(res[0].list.length > 0 && res[1].list.length > 0){
            const orResult = res[0].list[0];
            productionScheduleResult = orResult.ProductionScheduleResult;
          
            const orInput = res[1].list[0];
            orders = orInput.Orders;
            lineStaticData = orInput.LineStaticData;
          }
          let scenarioData = res[2];

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
        this.orResultService.getCurrentScenarioResult(),
        this.orInputService.getCurrentScenarioInput(),
        this.lineService.find({}),
        this.scenarioService.findCurrentScenarioData(),
        ]).subscribe(res => {
          let productionScheduleResult = [];
          let productStaticData = [];
          let lineStaticData = [];
          if(res[0].list.length > 0 && res[1].list.length > 0){
            const orResult = res[0].list[0];
            productionScheduleResult = orResult.ProductionScheduleResult;
          
            const orInput = res[1].list[0];
            productStaticData = orInput.ProductStaticData;
            lineStaticData = orInput.LineStaticData;
          }
        
          let lines = res[2].list;
          const scenarioData = res[3];

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
              if(productStaticMap[productSchedule.orderName]){
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
                });
              }
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

        items.sort((a, b) => a.content.produceTime - b.content.produceTime);

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

}
