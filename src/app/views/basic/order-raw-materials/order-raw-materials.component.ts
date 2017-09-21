import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ItemBOMService } from 'app/services/item-bom.service';
import { ItemService } from 'app/services/item.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {IOption} from 'ng-select';


@Component({
  selector: 'app-order-raw-materials',
  templateUrl: './order-raw-materials.component.html',
  styleUrls: ['./order-raw-materials.component.css'],
  providers: [ ItemBOMService, ItemService]
})
export class OrderRawMaterialsComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  orderOptions: Array<IOption> = [];
  rawMaterialOptions: Array<IOption> = [];

  constructor(
    private itemBOMService: ItemBOMService, 
    private itemService: ItemService, 
    public toastr: ToastsManager, 
    vcr: ViewContainerRef) { 
      this.toastr.setRootViewContainerRef(vcr);
    }

  ngOnInit() {
    this.loadData();
  }

  remove(item){
    let i = this.dataList.findIndex(i => i.orderName == item.orderName)
    this.dataList.splice(i,1);
  }

  add(){
    this.errMsg = '';
    this.detailItem = {isNew: true, type: 'raw'};
    this.detailModal.show();
  }

  modify(item) {
    this.errMsg = '';
    this.detailItem = JSON.parse(JSON.stringify(item));
    this.detailItem.item = this.detailItem.item._id;
    if (this.detailItem.materials && this.detailItem.materials.length > 0) {
      this.detailItem.materials.forEach(m => {
        m.item = m.item._id;
      });
    }
    this.detailModal.show();
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  addNewRawMaterial() {
    if(this.detailItem.materials){
      this.detailItem.materials.push({
        "item": "",
        "amount": 0
      });
    }else{
      this.detailItem.materials = [{
        "item": "",
        "amount": 0
      }]
    }
  }

  confirmChange(){
    this.itemBOMService.save(this.detailItem).subscribe(res =>{
      console.log(res);
      this.loadData();
      this.detailModal.hide();
    })
  }

  loadData(){
    this.itemBOMService.find({}).subscribe(res => {
        console.log(res.count);
        console.log(res.list);
        this.dataList = res.list;
      });

    this.itemService.findProduct({}).subscribe(res => {
        let orders = res.list;
        let orderOptionArray = [];
        orders.forEach(order => {
          orderOptionArray.push({
            label: order.name,
            value: order._id
          })
        })
        this.orderOptions = orderOptionArray;
      });

    this.itemService.findRawMaterial({}).subscribe(res => {
        let materials = res.list;
        let rawMaterialOptionArray = [];
        materials.forEach(material => {
          rawMaterialOptionArray.push({
            label: material.name,
            value: material._id
          })
        })
        this.rawMaterialOptions = rawMaterialOptionArray;
      });

  }

}
