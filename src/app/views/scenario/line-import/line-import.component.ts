import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-line-import',
  templateUrl: './line-import.component.html',
  styleUrls: ['./line-import.component.css']
})
export class LineImportComponent implements OnInit {

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/import/data/line',
  };

  constructor(
    private toolsService: ToolsService,
  ) { }

  ngOnInit() {
  }

  public onUploadSuccess(event) {
    this.toolsService.processImportedLineData().then(res => {
      location.reload();
    });
  }

  public onUploadError(event) {
    console.log('error');
  }

}
