import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { MaterialService } from 'app/services/material.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { ScheduleService } from 'app/utils/schedule.service';
import {PurchasePlanService} from 'app/services/purchase-plan.service';
import {OrderDemandService} from 'app/services/order-demand.service';
import { ItemService } from 'app/services/item.service';

import { ToolsService } from 'app/utils/tools.service';
import { ScenarioService } from 'app/services/scenario.service';
import { ModalDirective } from 'ngx-bootstrap';

import { IOption } from 'ng-select';

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

@Component({
  selector: 'app-order-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './order-calendar.component.html',
  styleUrls: ['./order-calendar.component.css'],
  providers: [ MaterialService, ToolsService, ScheduleService, ScenarioService, OrderDemandService, 
    PurchasePlanService, ItemService]
})
export class OrderCalendarComponent implements OnInit {
  @ViewChild('orderDemandModal') public orderDemandModal: ModalDirective;

  dataList: any[] = [];
  dateRange: Date[];
  totalSize: number = 0;
  view: string = 'month';
  errorMessage: any;
  events: CalendarEvent[] = [];
  calendarEvents: CalendarEvent[] = [];
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  parameters: any = {};
  orderDemandDetailItem: any = {};
  orderOptions: Array<IOption> = [];

  constructor(private materialService: MaterialService, 
    private toolsService: ToolsService,
    private purchasePlanService: PurchasePlanService,
    private orderDemandService: OrderDemandService,
    private itemService: ItemService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.loadData();
    this.prepareOrders();
  }

  refresh: Subject<any> = new Subject();

  loadData() {
    this.scenarioService.findCurrentScenarioData().subscribe(res => {
      this.parameters = res;
      this.viewDate = new Date(this.parameters.startDate);

      this.itemService.findProduct({})
        .subscribe(res => {
          this.dataList = res.list;
          this.totalSize = res.count;
        }, error => {
          this.errorMessage = <any>error;
        });

      this.scheduleService.getPurchasePlanData().subscribe(res => {
          this.events = res.calenderEvents;
          this.calendarEvents = res.calenderEvents;
          // this.events.forEach(event => {
          //   event.actions = this.actions;
          // })
          this.refresh.next()
        })
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  filterCalendarItem(material){
    this.calendarEvents = this.events.filter(event => {
      return event.meta.item.name == material.name;
    })
    this.refresh.next();
  }

  orderDemand(){
    var dates = this.toolsService.getScenarioDates();
    this.dateRange = dates;

    this.orderDemandDetailItem.orderDemands = [];
    this.dateRange.forEach(d => {
      this.orderDemandDetailItem.orderDemands.push({
        date: d,
        amount: 0
      });
    })
    this.orderDemandModal.show();
  }

  confirmOrderDemand(){
    let batchDemands = [];
    this.orderDemandDetailItem.orderDemands.forEach(od => {
      od.item = this.orderDemandDetailItem.item;
      if(od.amount > 0) batchDemands.push(od);
    })
    this.orderDemandService.batchInsert(batchDemands).subscribe(res => {
      console.log(res);
      this.loadData();
      this.orderDemandModal.hide();
    });
  }

  prepareOrders(){
    this.itemService.findProduct({}).subscribe(res => {
        let products = res.list;
        let optionArray = [];
        products.forEach(material => {
          optionArray.push({
            label: material.name,
            value: material._id
          })
        })
        this.orderOptions = optionArray;
      });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.currentCalendarEvent = event.meta;
    // this.calendarDetailModal.show();
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

}
