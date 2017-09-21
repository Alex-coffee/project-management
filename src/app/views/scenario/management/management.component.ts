import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';

import { ScenarioService } from 'app/services/scenario.service';

import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css'],
  providers: [ ScenarioService]
})
export class ManagementComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  @ViewChild('loadScenarioModal') public loadScenarioModal:ModalDirective;
  
  dataList: any[] = [];
  detailItem: any = {};
  currentScenario: any;
  errMsg: string;

  constructor(
    private scenarioService: ScenarioService,
    public toastr: ToastsManager, vcr: ViewContainerRef
  ) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getScenarios();
  }

  getScenarios(){
    this.scenarioService.find({}).subscribe(res => {
      console.log(res.count);
      console.log(res.list);
      this.dataList = res.list;
    });
  }

  setCurrentScenario(scenario: any){
    this.currentScenario = scenario;
    this.loadScenarioModal.show();
  }

  loadCurrentScenario(){
    localStorage.setItem('currentScenario', JSON.stringify(this.currentScenario));
    this.loadScenarioModal.hide();
  }

  add(){
    this.errMsg = "";
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item){
    this.errMsg = "";
    this.detailItem = JSON.parse(JSON.stringify(item));
    this.detailItem.startDate = new Date(this.detailItem.startDate);
    this.detailItem.endDate = new Date(this.detailItem.endDate);
    this.detailModal.show();
  }

  delete(item){
    this.scenarioService.remove(item).subscribe(res =>{
      console.log(res);
      this.getScenarios();
    })
  }

  confirmChange(){
    this.scenarioService.save(this.detailItem).subscribe(res =>{
      localStorage.setItem('currentScenario', JSON.stringify(res));
      this.getScenarios();
      this.detailModal.hide();
    })

    
  }

}
