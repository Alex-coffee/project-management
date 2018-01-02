import { Component, OnInit, ViewContainerRef, EventEmitter, Output} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OptimizeService } from 'app/services/optimize.service';
import { ScenarioService } from 'app/services/scenario.service';
import { ScheduleService } from 'app/utils/schedule.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { OrderDemandService } from 'app/services/order-demand.service';
import { ToolsService } from 'app/utils/tools.service';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [ DataService, OptimizeService, ScenarioService, ToolsService,
    ScheduleService, PurchasePlanService, OrderDemandService]
})
export class ParametersComponent implements OnInit {
  parameters: any = {};
  inProcess:boolean = false;
  @Output()
  private orCallback: EventEmitter<any>;
  safeStorageCalculateOptions: Array<IOption> = [];

  constructor(
    private dataService: DataService, 
    private optimizeService: OptimizeService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService,
    private router: Router,
    public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
              this.orCallback  = new EventEmitter<any>();
            }

  ngOnInit() {
    this.loadData();

    this.safeStorageCalculateOptions.push({ label: '用户输入', value: 'user' });
    this.safeStorageCalculateOptions.push({ label: '最大需求', value: 'max' });
    this.safeStorageCalculateOptions.push({ label: '平均需求', value: 'avg' });
  }

  save(){
    this.dataService.saveParameters(this.parameters)
      .subscribe(res => {
        this.toastr.success(res.message);
      });
  }

  runOR(): void{
    this.scenarioService.save(this.parameters).subscribe(result => {
      localStorage.setItem('currentScenario', JSON.stringify(result));
      console.log(result);
      this.scheduleService.runOR().subscribe(res => {
        this.orCallback.emit();
      });
    });
  }

  loadData(){
    this.scenarioService.findCurrentScenarioData().subscribe(res => {
      this.parameters = res;
      this.parameters.startDate = new Date(this.parameters.startDate);
      this.parameters.endDate = new Date(this.parameters.endDate);
    });

    // this.dataService.getParameters()
    //   .subscribe(res => {
    //     this.parameters = res;
    //   });
  }

}
