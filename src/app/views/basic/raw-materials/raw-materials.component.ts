import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-raw-materials',
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css'],
  providers: [ DataService ]
})
export class RawMaterialsComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
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
    this.dataService.saveRawMaterialData(this.dataList)
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

  modify(item){
    this.errMsg = "";
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange(){
    let targetIndex = this.dataList.findIndex(item => item.rawId == this.detailItem.rawId);
    if(this.detailItem.isNew){//add new item
      if(targetIndex > -1){
        this.errMsg = "已存在ID相同的原材料";
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
    this.dataService.getRawMaterials()
      .subscribe(res => {
        this.dataList = res;
      });
  }
}
