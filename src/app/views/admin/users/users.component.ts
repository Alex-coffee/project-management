import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [ UserService ]
})
export class UsersComponent implements OnInit {

  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('pwdModal') public pwdModal: ModalDirective;
  @ViewChild('detailForm') public detailForm;

  detailItem: any = {};
  userItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  p: any;

  constructor(private userService: UserService, public toastr: ToastsManager,
            vcr: ViewContainerRef) {
              this.toastr.setRootViewContainerRef(vcr);
            }

  ngOnInit() {
    this.loadData();
  }

  remove(item){
    this.userService.remove(item).subscribe(res =>{
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

  resetPwdModal(item) {
    this.userItem = {_id: item._id, pwd: '', repeatPwd: ''};
    this.pwdModal.show();
  }

  confirmChange() {
    const saveObj = Object.assign({}, this.detailItem);

    if(!saveObj._id){// encrpyt password when the user being created
      saveObj.pwd = Md5.hashStr(saveObj.pwd);
    }

    this.userService.find({email: saveObj.email}).subscribe(result => {
      if (result.count > 0) {
        this.toastr.error('已存在邮箱名为' + saveObj.email + '的记录');
        return ;
      } else {
        this.userService.save(saveObj).subscribe(res => {
          this.loadData();
          this.detailModal.hide();
        });
      }
    });
  }

  confirmReset() {
    const saveObj = Object.assign({}, this.userItem);
    saveObj.pwd = Md5.hashStr(saveObj.pwd);

    this.userService.save(saveObj).subscribe(res => {
      this.loadData();
      this.pwdModal.hide();
    });
  }

  loadData() {
    this.userService.find({}).subscribe(res => {
        this.dataList = res.list;
      });
  }

}
