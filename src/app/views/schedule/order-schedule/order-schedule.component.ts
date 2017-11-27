import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OrderDemandService } from 'app/services/order-demand.service';
import { ScenarioService } from 'app/services/scenario.service';
import { ScheduleService } from 'app/utils/schedule.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { ToolsService } from 'app/utils/tools.service';
import { ItemService } from 'app/services/item.service';
import { ModalDirective } from 'ngx-bootstrap';
import { IOption } from 'ng-select';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { DataSheetDirective } from 'app/directive/data-sheet.directive';

@Component({
  selector: 'app-order-schedule',
  templateUrl: './order-schedule.component.html',
  styleUrls: ['./order-schedule.component.css'],
  providers: [ OrderDemandService, ScenarioService, ToolsService,
    ScheduleService, ItemService, PurchasePlanService ]
})
export class OrderScheduleComponent implements OnInit {
  @ViewChild('orderScheduleModal') public orderScheduleModal: ModalDirective;
  @ViewChild(DataSheetDirective) dataSheet: DataSheetDirective;

  dataList: any[];
  dateRanges: any[];
  errorMessage: any;
  detailItem: any = {};
  orderOptions: Array<IOption> = [];
  searchContent: string = '';

  constructor(
    private orderDemandService: OrderDemandService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService,
    private purchasePlanService: PurchasePlanService,
    private toolsService: ToolsService,
    private itemService: ItemService,
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadData();
    this.prepareOrders();
  }

  loadData() {
    const currentScenarioObj = JSON.parse(localStorage.getItem('currentScenario'));
    this.dateRanges = this.toolsService.getDateArrayByRange(new Date(currentScenarioObj.startDate),
    new Date(currentScenarioObj.endDate));

    this.scheduleService.getOrderSchedulePlanData(undefined).subscribe(res => {
      this.dataList = res.orderScheduleList;
    });
  }

  searchProduct() {
    this.itemService.findProduct({
      $or:[
        {"desc": {$regex: this.searchContent, $options:'i'}},
        {"name": {$regex: this.searchContent, $options:'i'}}
      ], 
      type: "product"
    }).subscribe(res => {
      const ids = [];
      res.list.forEach(p => {
        ids.push(p._id);
      });
      
      this.scheduleService.getOrderSchedulePlanData(ids).subscribe(res => {
        this.dataList = res.orderScheduleList;
      });
    });
  }

  clearSearch() {
    this.searchContent = "";
    this.loadData();
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  modifyOrderSchedule(orderDemand, date, item) {
    this.detailItem = orderDemand;
    if (!orderDemand) {
      this.detailItem = {
        item: item.order._id.toString(),
        date: date,
        amount: 0
      };
    } else {
      this.detailItem.item = this.detailItem.item._id.toString();
    }
    this.orderScheduleModal.show();
  }

  confirmOrderDemand() {
    this.orderDemandService.save(this.detailItem).subscribe(res => {
      this.toastr.success('保存成功');
      this.loadData();
      this.orderScheduleModal.hide();
    });
  }

  prepareOrders() {
    this.itemService.findProduct({}).subscribe(res => {
        const products = res.list;
        const optionArray = [];
        products.forEach(material => {
          optionArray.push({
            label: material.name,
            value: material._id
          });
        });
        this.orderOptions = optionArray;
      });
  }

}
