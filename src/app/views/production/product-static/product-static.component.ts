import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ProductStaticService } from 'app/services/product-static.service';
import { ItemService } from 'app/services/item.service';
import { LineService } from 'app/services/line.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {IOption} from 'ng-select';

@Component({
  selector: 'app-product-static',
  templateUrl: './product-static.component.html',
  styleUrls: ['./product-static.component.css'],
  providers: [ ProductStaticService, ItemService, LineService ]
})
export class ProductStaticComponent implements OnInit {
  @ViewChild('detailModal') public detailModal:ModalDirective;
  detailItem: any = {};
  dataList: any[] = [];
  errMsg: string;
  orderOptions: Array<IOption> = [];
  lineOptions: Array<IOption> = [];
  subLineOptions: Array<IOption> = [];
  searchContent: string;
  p: any;

  constructor(
    private productStaticService: ProductStaticService, 
    private itemService: ItemService, 
    private lineService: LineService, 
    public toastr: ToastsManager, 
    vcr: ViewContainerRef
  ) { 
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadData();
    this.prepareOrders();
    this.prepareLines();
  }

  remove(item){
    this.productStaticService.remove(item).subscribe(res =>{
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
    this.detailItem.product = this.detailItem.product._id;
    this.detailItem.mainLine = this.detailItem.mainLine._id;
    if(this.detailItem.subLine) {
      this.detailItem.subLine = this.detailItem.subLine._id;
    }else{
      this.detailItem.subLine = "undefined";
    }
    this.detailModal.show();
  }

  confirmChange(){
    if(this.detailItem.subLine == undefined) delete this.detailItem.subLine;
    this.productStaticService.save(this.detailItem).subscribe(res => {
      console.log(res);
      this.loadData();
      this.detailModal.hide();
    })
  }

  loadData(){
    this.productStaticService.find({}).subscribe(res => {
      console.log(res.count);
        console.log(res.list);
        this.dataList = res.list;
    });
  }

  prepareOrders(){
    this.itemService.findProduct({}).subscribe(res => {
        let products = res.list;
        let optionArray = [];
        products.forEach(material => {
          optionArray.push({
            label: material.name,
            value: material._id
          })
        })
        this.orderOptions = optionArray;
      });
  }

  searchProduct() {
    this.itemService.findProduct({
      $or:[
        {"desc": {$regex: this.searchContent, $options:'i'}},
        {"name": {$regex: this.searchContent, $options:'i'}}
      ], 
      type: "product"
    }).subscribe(res => {
      const ids = [];
      res.list.forEach(p => {
        ids.push(p._id);
      })
      this.productStaticService.find({"product": {$in: ids}}).subscribe(res => {
        this.dataList = res.list;
      });
    });
  }

  clearSearch() {
    this.searchContent = "";
    this.loadData();
  }

  prepareLines(){
    this.lineService.find({}).subscribe(res => {
        let lines = res.list;
        let optionArray = [];
        let subLineOptionArray = [];

        subLineOptionArray.push({
          label: "不使用",
          value: "undefined"
        })

        lines.forEach(line => {
          optionArray.push({
            label: line.name,
            value: line._id
          })

          subLineOptionArray.push({
            label: line.name,
            value: line._id
          })
        })
        this.lineOptions = optionArray;
        this.subLineOptions = subLineOptionArray;
      });
  }

  
}
