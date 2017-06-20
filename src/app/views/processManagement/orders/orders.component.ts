import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../services/backend.service';
import { Order } from '../../../model/order';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styleUrls: ['orders.component.css'],
  providers: [ BackendService ]
})
export class OrdersComponent implements OnInit {
  errorMessage: string;
  orderData: Order[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.getOrderData();
  }

  getOrderData() {
    this.backendService.getOrderData()
                     .subscribe(
                       orderData => this.orderData = orderData,
                       error =>  this.errorMessage = <any>error);
  }

}
