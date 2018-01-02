import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductionPlanService } from 'app/services/production-plan.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { ScenarioService } from 'app/services/scenario.service';
import { ScheduleService } from 'app/utils/schedule.service';
import { ToolsService } from 'app/utils/tools.service';
import { ItemService } from 'app/services/item.service';
import { ModalDirective } from 'ngx-bootstrap';
import { IOption } from 'ng-select';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OrResultService } from 'app/services/or-result.service';
import { OrderDemandService } from 'app/services/order-demand.service';


@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css'],
  providers: [ ProductionPlanService, ScenarioService, ToolsService, PurchasePlanService,
    ScheduleService, ItemService, OrResultService, OrderDemandService ]
})
export class ScheduleTableComponent implements OnInit {
  @ViewChild('productPlanModal') public productPlanModal: ModalDirective;

  dataList: any[];
  dateRanges: any[];
  errorMessage: any;
  detailItem: any = {};
  orderOptions: Array<IOption> = [];
  searchContent: string = '';
  p: any;
  startDate: Date;
  endDate: Date;

  constructor(
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService,
    private orResultService: OrResultService,
    private productionPlanService: ProductionPlanService,
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
    if(this.startDate == undefined){
      this.startDate = new Date(currentScenarioObj.startDate);
    }

    if(this.endDate == undefined){
      this.endDate = new Date(currentScenarioObj.endDate);
    }

    this.dateRanges = this.toolsService.getDateArrayByRange(this.startDate, this.endDate);

    this.scheduleService.getOrderScheduleProductionPlanData(undefined).subscribe(res => {
      this.dataList = res.productionScheduleList;
    });
  }

  searchSchedule() {
    this.loadData();
  }

  getProductionSchedule(day, productionSchedule) {
    return productionSchedule.scheduleArray.find(s => new Date(s.date).getTime() == day.getTime());
  }

  searchProduct() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.itemService.findProduct({
      $or:[
        {"desc": {$regex: this.searchContent, $options:'i'}},
        {"name": {$regex: this.searchContent, $options:'i'}}
      ], 
      type: "product",
      company: currentUser.company
    }).subscribe(res => {
      const ids = [];
      res.list.forEach(p => {
        ids.push(p._id);
      });
      
      this.scheduleService.getOrderScheduleProductionPlanData(ids).subscribe(res => {
        this.dataList = res.productionScheduleList;
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

  savePPAmount(value, schedule) {
    schedule.amount = value;
    this.productionPlanService.save(schedule).subscribe(res => {
      this.toastr.success('保存成功');
      this.loadData();
    });
  }

  modifyProductionPlan(productPlan, date, item) {
    this.detailItem = productPlan;
    //this.detailItem.item = this.detailItem.item._id.toString();
    this.productPlanModal.show();
  }

  confirmProductPlan() {
    this.productionPlanService.save(this.detailItem).subscribe(res => {
      this.toastr.success('保存成功');
      this.loadData();
      this.productPlanModal.hide();
    });
  }

}
