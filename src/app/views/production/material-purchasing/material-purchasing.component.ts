import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from 'app/services/data.service';
import {IOption} from 'ng-select';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-material-purchasing',
  templateUrl: './material-purchasing.component.html',
  styleUrls: ['./material-purchasing.component.css'],
  providers: [ DataService ]
})
export class MaterialPurchasingComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  rawMaterialList: any[] = [];
  dataList: any[] = [];
  errMsg: string;
  totalDays: number;
  supplyFormData: any;
  rawMaterialOptions: Array<IOption> = [];
  dayOptions: Array<IOption> = [];

  myOptions: Array<IOption> = [
        {label: 'Belgium', value: 'BE'},
        {label: 'Luxembourg', value: 'LU'},
        {label: 'Netherlands', value: 'NL'}
    ];

  constructor(private dataService: DataService, public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  save(){
    this.dataService.saveRawMaterialData(this.rawMaterialList)
      .subscribe(res => {
        this.toastr.success(res.message);
      });
  }

  remove(item){
    let i = this.dataList.findIndex(i => i.rawId == item.rawId)
    this.dataList.splice(i,1);
  }

  add(){
    this.errMsg = "";
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(mIndex, dayIndex){
    this.detailItem = {};
    this.detailItem["rawId"] = this.rawMaterialList[mIndex].rawId;
    this.detailItem["day"] = dayIndex;
    this.detailItem["num"] = this.rawMaterialList[mIndex]["supplys"][dayIndex];
    this.detailModal.show();
  }

  confirmChange(){
    let target = this.rawMaterialList.find(item => {
      return item.rawId == this.detailItem.rawId
    })
    target.supplys[this.detailItem.day] = this.detailItem.num;
    this.supplyFormData = this.dataService.processSupplyFormData(this.rawMaterialList, this.totalDays);
    this.detailModal.hide();
  }

  loadData(){
    this.dataService.getMaterialPurchaseData().subscribe(res => {
        this.rawMaterialList = res.rawMaterials;
        this.totalDays = res.totalDays;

        let rawMaterials = []
        this.rawMaterialList.forEach(rm => {
          rawMaterials.push({
            label: rm.rawName, 
            value: rm.rawId.toString()
          });
        })

        let dayArray = new Array(this.totalDays);
        for(let i = 0; i < dayArray.length; i++){
          dayArray[i] = {
            label: "第" + i + "天", 
            value: i
          }
        }
      
        this.rawMaterialOptions = rawMaterials;
        this.dayOptions = dayArray;

        this.supplyFormData = this.dataService.processSupplyFormData(this.rawMaterialList, this.totalDays);
    })
  }

}
