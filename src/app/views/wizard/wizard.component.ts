import { Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from 'app/services/item.service';
import { AuthenticationService } from 'app/utils/authentication.service';
import { OrResultService } from 'app/services/or-result.service';
import { ProductionPlanService } from 'app/services/production-plan.service';
import { ToolsService } from 'app/utils/tools.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
  providers: [ ItemService, AuthenticationService, OrResultService, ToolsService, ProductionPlanService]
})
export class WizardComponent implements OnInit {
  @ViewChild('formWizard') public formWizard;
  @ViewChild('parameter') public parameter;

  showPlanConent = false;
  showConfigConent = false;
  showORConent = false;
  showResultConent = false;
  showAppliedConent = false;
  isOrResultGenerated = false;
  isProductPlanGenerated = false;
  dateRanges = [];

  constructor(
    private orResultService: OrResultService,
    private productionPlanService: ProductionPlanService,
    private toolsService: ToolsService,
    public toastr: ToastsManager,
    public router: Router,
    vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    const currentScenarioObj = JSON.parse(localStorage.getItem('currentScenario'));
    this.dateRanges = this.toolsService.getDateArrayByRange(new Date(currentScenarioObj.startDate),
    new Date(currentScenarioObj.endDate));

    this.orResultService.getCurrentScenarioResult().subscribe(res => {
      console.log(res)
      if(res.list.length > 0){
        var orResult = res.list[0];
        this.isOrResultGenerated = true;
      }
    });

    this.productionPlanService.find({}).subscribe(res => {
      console.log(res)
      if(res.list.length > 0){
        this.isProductPlanGenerated = true;
      }
    });
  }

  public next(itemToShow){
    if ('plan' === itemToShow) {
      this.showPlanConent = true;
    } else if ('config' === itemToShow) {
      this.showConfigConent = true;
    } else if ('or' === itemToShow) {
      this.showORConent = true;
    } else if ('result' === itemToShow) {
      // this.showResultConent = true;
    }

    this.formWizard.next();
  }

  orProcessEnded = false;
  public runOR() {
    this.orProcessEnded = false; 
    this.showResultConent = false;
    this.formWizard.next();
    this.parameter.runOR();
  }

  public checkResult() {
    this.orProcessEnded = true; 
    this.showResultConent = true;
    this.formWizard.next();
    this.formWizard.next();
  }

  public wizardORCallback() {
    setTimeout(() => { 
      this.orProcessEnded = true; 
      this.showResultConent = true;
      this.formWizard.next(); 
    }, 5000);
  }

  public applyResult() {
    this.orResultService.getCurrentScenarioResult().subscribe(res => {
      console.log(res)
      if(res.list.length > 0){
        var orResult = res.list[0];

        let productionSchedule = [];
        if (orResult.ProductionScheduleResult) {
          orResult.ProductionScheduleResult.forEach(ps => {

            for(let i = 0; i < this.dateRanges.length; i++){
              const pp = ps.plan.find(plan => plan.time == i);
              if(pp){
                productionSchedule.push({
                  date: this.dateRanges[pp.time],
                  amount: pp.amount,
                  item: ps.orderId,
                  line: pp.line
                });
              }else{
                productionSchedule.push({
                  date: this.dateRanges[i],
                  amount: 0,
                  item: ps.orderId
                });
              }
            }
          });

          this.productionPlanService.clearDataByScenario().subscribe(r => {
            console.log("cleared");
            this.productionPlanService.insertMany(productionSchedule).subscribe(result => {
              this.toastr.success("已应用" + result.length + "条排产方案")
              this.router.navigateByUrl("/plan/schedule");
            });
          });
        }
      }
    });

    
  }
}
