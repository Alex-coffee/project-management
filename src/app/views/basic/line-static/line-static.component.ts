import { Component, OnInit, ViewChild} from '@angular/core';
import { DataService } from 'app/services/data.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-line-static',
  templateUrl: './line-static.component.html',
  styleUrls: ['./line-static.component.css'],
  providers: [ DataService ]
})
export class LineStaticComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  itemOnEdit: any = {};
  dataList: any[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadData();
  }

  add(){
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item){
    this.itemOnEdit = item;
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange(){
    if(this.detailItem.isNew){//add new item
      this.dataList.push(this.detailItem);
    }else{
      this.itemOnEdit = this.detailItem;
    }
    this.detailModal.hide();
  }

  loadData(){
    this.dataService.getLineStatic()
      .subscribe(res => {
        this.dataList = res;
      });
  }



}
