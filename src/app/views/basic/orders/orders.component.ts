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
      this.detailModal.hide();
    })
  }

  loadData() {
    this.itemService.findProduct({}).subscribe(res => {
        this.dataList = res.list;
      });
  }
}
