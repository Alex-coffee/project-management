import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { RawMaterial } from '../../../model/raw-material';

@Component({
  selector: 'app-raw-materials',
  templateUrl: 'raw-materials.component.html',
  styleUrls: ['raw-materials.component.css'],
  providers: [ BackendService ]
})
export class RawMaterialsComponent implements OnInit {
  errorMessage: string;
  rawMaterialData: RawMaterial[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getRawMaterialData();
  }

  getRawMaterialData() {
    this.backendService.getRawMaterialData()
                     .subscribe(
                       rawMaterialData => this.rawMaterialData = rawMaterialData,
                       error =>  this.errorMessage = <any>error);
  }

}
