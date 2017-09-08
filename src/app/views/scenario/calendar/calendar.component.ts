import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ItemService } from 'app/services/item.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { OrderDemandService } from 'app/services/order-demand.service';
import { ScenarioService } from 'app/services/scenario.service';

import { ToolsService } from 'app/utils/tools.service';
import { ScheduleService } from 'app/utils/schedule.service';

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
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [ ItemService, ToolsService, PurchasePlanService, OrderDemandService, ScenarioService, ScheduleService]
})
export class CalendarComponent implements OnInit {
  @ViewChild('purchaseMaterialModal') public purchaseMaterialModal:ModalDirective;
  @ViewChild('orderDemandModal') public orderDemandModal:ModalDirective;
  @ViewChild('orSettingsModal') public orSettingsModal:ModalDirective;
  @ViewChild('calendarDetailModal') public calendarDetailModal:ModalDirective;
  
  materialPurchaseDetailItem: any = {};
  orderDemandDetailItem: any = {};
  view: string = 'month';
  viewDate: Date = new Date();
  rawMaterialOptions: Array<IOption> = [];
  orderOptions: Array<IOption> = [];
  parameters: any = {};
  currentCalendarEvent: any;

  dateRange: Date[];
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  events: CalendarEvent[] = [];

  constructor(
    private itemService: ItemService, 
    private toolsService: ToolsService,
    private purchasePlanService: PurchasePlanService,
    private orderDemandService: OrderDemandService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService,
    public toastr: ToastsManager, 
    vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.prepareMaterials();
    this.prepareOrders();
    this.loadData();
  }

  loadData(){
    this.scenarioService.findCurrentScenarioData().subscribe(res => {
      this.parameters = res;
      this.viewDate = new Date(this.parameters.startDate);
    })

    this.scheduleService.getAllScheduleData().subscribe(res => {
      this.events = res.calenderEvents;
      this.events.forEach(event => {
        event.actions = this.actions;
      })
      this.refresh.next()
    })
  }

  runOR(): void{
    this.scenarioService.save(this.parameters).subscribe(result => {
      localStorage.setItem('currentScenario', JSON.stringify(result));
      this.scheduleService.runOR().subscribe(res => {
        this.events = res.calenderEvents;
      })
    })
  }

  activeDayIsOpen: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('delete', event);
      }
    }
  ];

  handleEvent(action: string, event: CalendarEvent): void {
    this.currentCalendarEvent = event.meta;
    this.calendarDetailModal.show();
    // this.modal.open(this.modalContent, { size: 'lg' });
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

  refresh: Subject<any> = new Subject();

  purchaseMaterial(){
    var dates = this.toolsService.getScenarioDates();
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

  confirmPurchasePlan(){
    let batchPlans = [];
    this.materialPurchaseDetailItem.purchasePlans.forEach(plan => {
      plan.item = this.materialPurchaseDetailItem.item;
      if(plan.amount > 0) batchPlans.push(plan);
    })
    this.purchasePlanService.batchInsert(batchPlans).subscribe(res => {
      console.log(res);
      this.loadData();
      this.purchaseMaterialModal.hide();
    });
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
  

  trackByIndex(index: number, value: number) {
    return index;
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

}
