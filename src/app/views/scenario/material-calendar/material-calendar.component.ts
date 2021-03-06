import { Component, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { MaterialService } from 'app/services/material.service';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { ModalDirective } from 'ngx-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { ScheduleService } from 'app/utils/schedule.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { OrderDemandService } from 'app/services/order-demand.service';
import { ItemService } from 'app/services/item.service';

import { ToolsService } from 'app/utils/tools.service';
import { ScenarioService } from 'app/services/scenario.service';
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
  selector: 'app-material-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './material-calendar.component.html',
  styleUrls: ['./material-calendar.component.css'],
  providers: [ MaterialService, ToolsService, ScheduleService, ScenarioService, OrderDemandService,
    PurchasePlanService, ItemService]
})
export class MaterialCalendarComponent implements OnInit {
  @ViewChild('purchaseMaterialModal') public purchaseMaterialModal: ModalDirective;

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
  materialPurchaseDetailItem: any = {};
  rawMaterialOptions: Array<IOption> = [];
  p: any;

  constructor(private materialService: MaterialService,
    private toolsService: ToolsService,
    private purchasePlanService: PurchasePlanService,
    private itemService: ItemService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.loadData();
    this.prepareMaterials();
  }

  refresh: Subject<any> = new Subject();

  loadData() {
    this.scenarioService.findCurrentScenarioData().subscribe(res => {
      this.parameters = res;
      this.viewDate = new Date(this.parameters.startDate);

      this.itemService.findRawMaterial({})
        .subscribe(res => {
          this.dataList = res.list;
          this.totalSize = res.count;
        }, error => {
          this.errorMessage = <any>error;
        });

      this.scheduleService.getOrderDemandData().subscribe(res => {
          this.events = res.calenderEvents;
          this.calendarEvents = res.calenderEvents;
          // this.events.forEach(event => {
          //   event.actions = this.actions;
          // })
          this.refresh.next()
        });
    });
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
    });
    this.refresh.next();
  }

  purchaseMaterial(){
    const dates = this.toolsService.getScenarioDates();
    this.dateRange = dates;

    this.materialPurchaseDetailItem.purchasePlans = [];
    this.dateRange.forEach(d => {
      this.materialPurchaseDetailItem.purchasePlans.push({
        date: d,
        amount: 0
      });
    })
    this.purchaseMaterialModal.show();
  }

  confirmPurchasePlan(){
    const batchPlans = [];
    this.materialPurchaseDetailItem.purchasePlans.forEach(plan => {
      plan.item = this.materialPurchaseDetailItem.item;
      if (plan.amount > 0) batchPlans.push(plan);
    });
    this.purchasePlanService.batchInsert(batchPlans).subscribe(res => {
      console.log(res);
      this.loadData();
      this.purchaseMaterialModal.hide();
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    // this.currentCalendarEvent = event.meta;
    // this.calendarDetailModal.show();
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  //**** prepare select items
  prepareMaterials(){
    this.itemService.findRawMaterial({}).subscribe(res => {
        let materials = res.list;
        let rawMaterialOptionArray = [];
        materials.forEach(material => {
          rawMaterialOptionArray.push({
            label: material.name,
            value: material._id
          })
        })
        this.rawMaterialOptions = rawMaterialOptionArray;
      });
  }

}
