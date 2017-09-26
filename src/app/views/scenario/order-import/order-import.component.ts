import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';

@Component({
  selector: 'app-order-import',
  templateUrl: './order-import.component.html',
  styleUrls: ['./order-import.component.css']
})
export class OrderImportComponent implements OnInit {

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/api/data/order/import',
  };

  constructor() { }

  ngOnInit() {
  }

  public onUploadSuccess() {
    console.log('success');
  }

  public onUploadError() {
    console.log('error');
  }

}
