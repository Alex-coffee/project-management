import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-order-raw-materials',
  templateUrl: './order-raw-materials.component.html',
  styleUrls: ['./order-raw-materials.component.css'],
  providers: [ DataService ]
})
export class OrderRawMaterialsComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  orderOptions: Array<IOption> = [];
  rawMaterialOptions: Array<IOption> = [];

  constructor(private dataService: DataService, public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  save(){
    this.dataService.saveOrderRawMaterials(this.dataList)
      .subscribe(res => {
        this.toastr.success(res.message);
      });
  }

  remove(item){
    let i = this.dataList.findIndex(i => i.orderName == item.orderName)
    this.dataList.splice(i,1);
  }

  add(){
    this.errMsg = "";
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item){
    this.errMsg = "";
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  addNewRawMaterial(){
    if(this.detailItem.raws){
      this.detailItem.raws.push({
        "rawName": "",
        "amount": 0
      });
    }else{
      this.detailItem.raws = [{
        "rawName": "",
        "amount": 0
      }]
    }
  }

  confirmChange(){
    let targetIndex = this.dataList.findIndex(item => item.orderName == this.detailItem.orderName);
    if(this.detailItem.isNew){//add new item
      if(targetIndex > -1){
        this.errMsg = "已存在相同的产品设置";
        return;
      }
      delete this.detailItem.isNew;
      this.dataList.push(this.detailItem);
    }else{
      this.dataList[targetIndex] = this.detailItem;
    }
    this.detailModal.hide();
  }

  loadData(){
    this.dataService.getOrderRawMaterials()
      .subscribe(res => {
        this.dataList = res;
      });

    this.dataService.getOrders()
      .subscribe(res => {
        let orders = res;
        let orderOptionArray = [];
        orders.forEach(order => {
          orderOptionArray.push({
            label: order.orderName,
            value: order.orderName
          })
        })
        this.orderOptions = orderOptionArray;
      });

    this.dataService.getRawMaterials()
      .subscribe(res => {
        let rawMaterials = res;
        let rawMaterialOptionArray = [];
        rawMaterials.forEach(rm => {
          rawMaterialOptionArray.push({
            label: rm.rawName,
            value: rm.rawName
          })
        })
        this.rawMaterialOptions = rawMaterialOptionArray;
      });
  }

}
