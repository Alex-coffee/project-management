import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { OptimizeService } from 'app/services/optimize.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [ DataService, OptimizeService ]
})
export class ParametersComponent implements OnInit {
  parameters: any = {};
  inProcess:boolean = false;

  constructor(
    private dataService: DataService, 
    private optimizeService: OptimizeService,
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

  runOR(){
    this.inProcess = true;
    this.dataService.saveParameters(this.parameters)
      .subscribe(res => {
        this.optimizeService.runOR().subscribe(res => {
          this.inProcess = false;
          this.toastr.success(res.message);
          console.log(res);
          
          setTimeout(() => {
            this.router.navigateByUrl("/schedule/production-schedule");
          }, 1000);
        }, err => {
          this.inProcess = false;
          this.toastr.error("运行失败，请重试");
          console.log(err);
        })
      });
  }

  loadData(){
    this.dataService.getParameters()
      .subscribe(res => {
        this.parameters = res;
      });
  }

}
