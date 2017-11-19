import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IOption } from 'ng-select';
import { LineService } from 'app/services/line.service';
import { ToolsService } from 'app/utils/tools.service';

@Component({
  selector: 'app-line-static',
  templateUrl: './line-static.component.html',
  styleUrls: ['./line-static.component.css'],
  providers: [ LineService, ToolsService, DatePipe ]
})
export class LineStaticComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  dayOptions: Array<IOption> = [];

  constructor(
    private lineService: LineService,
    private toolsService: ToolsService,
    public toastr: ToastsManager,
    private datePipe: DatePipe,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadData();
  }

  remove(item) {
    this.lineService.remove(item).subscribe(res => {
      console.log(res);
      this.loadData();
    });
  }

  add() {
    this.errMsg = '';
    this.detailItem = {isNew: true};
    this.detailModal.show();
  }

  modify(item) {
    this.errMsg = '';
    this.detailItem = Object.assign({}, item);
    this.detailModal.show();
  }

  confirmChange() {
    this.lineService.save(this.detailItem).subscribe(res => {
      console.log(res);
      this.loadData();
      this.detailModal.hide();
    });
  }

  loadData() {
    this.lineService.find({}).subscribe(res => {
      console.log(res.count);
      console.log(res.list);
      this.dataList = res.list;
    });

    const scenarioDates = this.toolsService.getScenarioDates();
    if (scenarioDates) {
      scenarioDates.forEach(sDate => {
        this.dayOptions.push({
          label: this.datePipe.transform(sDate, 'yyyy-MM-dd'),
          value: this.datePipe.transform(sDate, 'yyyy-MM-dd')
        });
      });
    }
  }

  trackByIndex(index: number, value: number) {
    return index;
  }

  removeLineCloseSchedule(index: number) {
    this.detailItem.lineCloseSchedule.splice(index, 1);
  }

  addLineCloseSchedule() {
    if (this.detailItem.lineCloseSchedule === undefined) {
      this.detailItem.lineCloseSchedule = [];
    }
    this.detailItem.lineCloseSchedule.push({
      date: undefined,
      intervalStart: '00:00',
      intervalEnd: '06:00'
    });
  }

}
