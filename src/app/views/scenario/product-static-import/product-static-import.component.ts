import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-product-static-import',
  templateUrl: './product-static-import.component.html',
  styleUrls: ['./product-static-import.component.css'],
  providers: [ToolsService]
})
export class ProductStaticImportComponent implements OnInit {

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/import/data/productstatic',
  };

  constructor(
    private toolsService: ToolsService,
  ) { }

  ngOnInit() {
  }

  public onUploadSuccess(event) {
    this.toolsService.processImportedProductStaticData().then(res => {
      location.reload();
    });
  }

  public onUploadError(event) {
    console.log('error');
  }
}
