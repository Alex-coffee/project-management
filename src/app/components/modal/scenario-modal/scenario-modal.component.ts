import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ScenarioService } from 'app/services/scenario.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scenario-modal',
  templateUrl: './scenario-modal.component.html',
  styleUrls: ['./scenario-modal.component.css'],
  providers: [ ScenarioService]
})
export class ScenarioModalComponent implements OnInit {
  @ViewChild('scenarioListModal') public scenarioListModal: ModalDirective;
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('loadScenarioModal') public loadScenarioModal: ModalDirective;
  dataList: any[];
  currentScenario: any;
  detailItem: any = {};
  errMsg: string;

  constructor(
    private scenarioService: ScenarioService,
    private router: Router
  ) { }

  ngOnInit() {}

  openSecenarioListModal() {
    this.loadScenarios();
    this.scenarioListModal.show();
  }

  loadScenarios() {
    this.scenarioService.find({}).subscribe(res => {
      console.log(res.count);
      console.log(res.list);
      this.dataList = res.list;
    });
  }

  setCurrentScenario(scenario: any) {
    this.currentScenario = scenario;
    this.loadScenarioModal.show();
  }

  loadCurrentScenario() {
    localStorage.setItem('currentScenario', JSON.stringify(this.currentScenario));
    this.loadScenarioModal.hide();
    this.scenarioListModal.hide();
    this.router.navigateByUrl('blank').then(() => {
      this.router.navigateByUrl('/wizard/step');
    });
  }

  add() {
    this.errMsg = '';
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item) {
    this.errMsg = '';
    this.detailItem = JSON.parse(JSON.stringify(item));
    this.detailItem.startDate = new Date(this.detailItem.startDate);
    this.detailItem.endDate = new Date(this.detailItem.endDate);
    this.detailModal.show();
  }

  delete(item){
    this.scenarioService.remove(item).subscribe(res => {
      console.log(res);
      this.loadScenarios();
    });
  }

  confirmChange() {
    this.scenarioService.save(this.detailItem).subscribe(res =>{
      localStorage.setItem('currentScenario', JSON.stringify(res));
      this.loadScenarios();
      this.detailModal.hide();
    }); 
  }

}
