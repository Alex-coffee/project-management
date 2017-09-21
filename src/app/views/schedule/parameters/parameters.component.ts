import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OptimizeService } from 'app/services/optimize.service';
import { ScenarioService } from 'app/services/scenario.service';
import { ScheduleService } from 'app/utils/schedule.service';
import { PurchasePlanService } from 'app/services/purchase-plan.service';
import { OrderDemandService } from 'app/services/order-demand.service';
import { ToolsService } from 'app/utils/tools.service';
import { Router } from '@angular/router';

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

  constructor(
    private dataService: DataService, 
    private optimizeService: OptimizeService,
    private scenarioService: ScenarioService,
    private scheduleService: ScheduleService,
    private router: Router,
    public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
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
      this.scheduleService.runOR().subscribe(res => {
        console.log(res);
      });
    });
  }

  loadData(){
    this.scenarioService.findCurrentScenarioData().subscribe(res => {
      this.parameters = res;
      this.parameters.startDate = new Date(this.parameters.startDate);
      this.parameters.endDate = new Date(this.parameters.endDate);
      console.log(this.parameters);
    });

    // this.dataService.getParameters()
    //   .subscribe(res => {
    //     this.parameters = res;
    //   });
  }

}
