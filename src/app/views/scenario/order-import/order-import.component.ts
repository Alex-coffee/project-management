import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-order-import',
  templateUrl: './order-import.component.html',
  styleUrls: ['./order-import.component.css'],
  providers: [ToolsService]
})
export class OrderImportComponent implements OnInit {

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/api/data/order/import',
  };

  constructor(
    private toolsService: ToolsService,
  ) { }

  ngOnInit() {
  }

  public onUploadSuccess(event) {
    this.toolsService.processImportedOrderData().then(res => {
      location.reload();
    });
  }

  public onUploadError(event) {
    console.log('error');
  }

}
