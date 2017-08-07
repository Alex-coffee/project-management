import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { LineService } from 'app/services/line.service';
@Component({
  selector: 'app-line-static',
  templateUrl: './line-static.component.html',
  styleUrls: ['./line-static.component.css'],
  providers: [ LineService ]
})
export class LineStaticComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;

  constructor(private lineService: LineService, public toastr: ToastsManager, 
            vcr: ViewContainerRef) { 
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  remove(item){
    this.lineService.remove(item).subscribe(res =>{
      console.log(res);
      this.loadData();
    })
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
    this.lineService.save(this.detailItem).subscribe(res =>{
      console.log(res);
      this.loadData();
      this.detailModal.hide();
    })
  }

  loadData(){
    this.lineService.find({}).subscribe(res => {
        console.log(res.count);
        console.log(res.list);
        this.dataList = res.list;
      });
  }

}
