import { Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [ DataService ]
})
export class OrdersComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {demands:[]};
  totalDays: number;
  dataList: any[] = [];
  errMsg: string;
  public peityType:string = "bar";
  public peityOptions:any = { fill: ["#faa123"], width:100};

  constructor(private dataService: DataService, public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  save(){
    this.dataService.saveOrderData(this.dataList)
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
    let newDemands = [];
    for(let i = 0; i < this.totalDays; i++){
      newDemands.push(0);
    }
    this.detailItem = {isNew: true, demands: newDemands};
    this.detailModal.show();
  }

  modify(item){
    this.errMsg = "";
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange(){
    let targetIndex = this.dataList.findIndex(item => item.orderName == this.detailItem.orderName);
    if(this.detailItem.isNew){//add new item
      if(targetIndex > -1){
        this.errMsg = "已存在ID相同的订单";
        return;
      }
      delete this.detailItem.isNew;
      this.dataList.push(this.detailItem);
    }else{
      this.dataList[targetIndex] = this.detailItem;
    }
    this.detailModal.hide();
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  loadData(){
    this.dataService.getOrders()
      .subscribe(res => {
        this.dataList = res;
      });
      
    this.dataService.getParameters()
      .subscribe(res => {
        this.totalDays = res.numDays;
      });
    
  }

}
