import { Component, OnInit, ViewContainerRef} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.css'],
  providers: [ DataService ]
})
export class ParametersComponent implements OnInit {
  parameters: any = {};

  constructor(private dataService: DataService, public toastr: ToastsManager, 
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

  loadData(){
    this.dataService.getParameters()
      .subscribe(res => {
        this.parameters = res;
      });
  }

}
