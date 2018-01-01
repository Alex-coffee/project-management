import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ScenarioService } from 'app/services/scenario.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';
import { ToolsService } from 'app/utils/tools.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-scenario-modal',
  templateUrl: './scenario-modal.component.html',
  styleUrls: ['./scenario-modal.component.css'],
  providers: [ ScenarioService, ToolsService]
})
export class ScenarioModalComponent implements OnInit {
  @ViewChild('scenarioListModal') public scenarioListModal: ModalDirective;
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('loadScenarioModal') public loadScenarioModal: ModalDirective;
  dataList: any[];
  currentScenario: any;
  detailItem: any = {};
  errMsg: string;
  isScenarioSCVUploaded: boolean = false;
  uploadedFile: string;
  processMSG: string;
  inProcess: boolean = false;

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/import/data/scenario',
  };

  constructor(
    private scenarioService: ScenarioService,
    private toolsService: ToolsService,
    public toastr: ToastsManager,
    private router: Router
  ) { }

  ngOnInit() {}

  public onUploadSuccess(event) {
    if(event && event[1]){
      this.uploadedFile = event[1][0].filename;
      this.isScenarioSCVUploaded = true;
    }
  }

  public onUploadError(event) {
    console.log('error');
  }

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

      if(this.isScenarioSCVUploaded){
        this.processMSG = "文件处理中";
        this.inProcess = true;
        this.toolsService.processScenarioData(this.uploadedFile).then(respones => {
          this.inProcess = false;
          this.processMSG = undefined;
          this.loadScenarios();
          this.detailModal.hide();
        }, error => {
          this.toastr.error("文件处理失败");
          this.inProcess = false;
          this.processMSG = undefined;
        });
      }else{
        this.loadScenarios();
        this.detailModal.hide();
      }
    }); 
  }

}
