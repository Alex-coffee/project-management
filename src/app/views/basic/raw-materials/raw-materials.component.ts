import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { ItemService } from 'app/services/item.service';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css'],
  providers: [ ItemService]
})
export class RawMaterialsComponent implements OnInit {
  @ViewChild('detailModal') public detailModal: ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  orderOptions: Array<IOption> = [];

  constructor(
    private itemService: ItemService,
    public toastr: ToastsManager,
            vcr: ViewContainerRef) {
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  remove(item) {
    this.itemService.remove(item).subscribe(res => {
      console.log(res);
      this.loadData();
    });
  }

  add() {
    this.errMsg = '';
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item) {
    this.errMsg = '';
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange() {
    this.itemService.saveRawMaterial(this.detailItem).subscribe(res => {
      console.log(res);
      this.loadData();
      this.detailModal.hide();
    });
  }

  loadData(){
    this.itemService.findProduct({}).subscribe(res => {
      const orders = res.list;
      const orderOptionArray = [];
      orders.forEach(order => {
        orderOptionArray.push({
          label: order.name,
          value: order._id
        });
      });
      this.orderOptions = orderOptionArray;
    });

    this.itemService.findRawMaterial({}).subscribe(res => {
        console.log(res.count);
        console.log(res.list);
        this.dataList = res.list;
      });
  }
}
