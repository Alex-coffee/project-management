import { Component, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { HTTP_BASE } from 'app/config';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-scenario-data-import',
  templateUrl: './scenario-data-import.component.html',
  styleUrls: ['./scenario-data-import.component.css'],
  providers: [ToolsService]
})
export class ScenarioDataImportComponent implements OnInit {

  config: DropzoneConfigInterface = {
    url: HTTP_BASE + '/import/data/scenario',
  };

  constructor(
    private toolsService: ToolsService,
  ) { }

  ngOnInit() {
  }

  public onUploadSuccess(event) {
    if(event && event[1]){
      const uploadedFile = event[1][0].filename;
      this.toolsService.processScenarioData(uploadedFile).then(res => {
        location.reload();
      });
    }
  }

  public onUploadError(event) {
    console.log('error');
  }
}
