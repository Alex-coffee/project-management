import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CompanyService } from 'app/services/admin/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  providers: [ CompanyService ]
})
export class CompanyComponent implements OnInit {
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('detailForm') public detailForm;

  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  p: any;

  constructor(
    private companyService: CompanyService, 
    public toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadData();
  }

  remove(item){
    this.companyService.remove(item).subscribe(res =>{
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

  confirmChange() {
    const saveObj = Object.assign({}, this.detailItem);

    this.companyService.find({name: saveObj.name}).subscribe(result => {
      if (result.count > 0) {
        this.toastr.error('已存在公司名名为' + saveObj.name + '的记录');
        return ;
      } else {
        this.companyService.save(saveObj).subscribe(res => {
          this.loadData();
          this.detailModal.hide();
        });
      }
    });
  }

  loadData() {
    this.companyService.find({}).subscribe(res => {
        this.dataList = res.list;
      });
  }

}
