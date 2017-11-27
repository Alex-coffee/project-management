import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ItemService } from 'app/services/item.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [ ItemService ]
})
export class OrdersComponent implements OnInit {
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('dataImportModal') public dataImportModal: ModalDirective;

  detailItem: any = {demands: []};
  totalDays: number;
  dataList: any[] = [];
  errMsg: string;
  searchContent: string;

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
      this.loadData();
    });
  }

  add() {
    this.errMsg = "";
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item) {
    this.errMsg = "";
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange() {
    this.itemService.saveProduct(this.detailItem).subscribe(res =>{
      this.loadData();
      this.toastr.success('数据已保存');
      this.detailModal.hide();
    })
  }

  loadData() {
    this.itemService.findProduct({}).subscribe(res => {
        this.dataList = res.list;
      });
  }

  searchProduct() {
    this.itemService.findProduct({
      $or:[
        {"desc": {$regex: this.searchContent, $options:'i'}},
        {"name": {$regex: this.searchContent, $options:'i'}}
      ], 
      type: "product"
    }).subscribe(res => {
      this.dataList = res.list;
    });
  }

  clearSearch() {
    this.searchContent = "";
    this.loadData();
  }

  saveSaftyStorage(value, item) {
    item.saftyStorage = value;
    this.itemService.saveProduct(item).subscribe(res =>{
      this.toastr.success('安全库存已更新');
      this.loadData();
    })
  }

  saveInitialStorage(value, item) {
    item.initialStorage = value;
    this.itemService.saveProduct(item).subscribe(res =>{
      this.toastr.success('初始库存已更新');
      this.loadData();
    })
  }
}
