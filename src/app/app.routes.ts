import {Routes} from "@angular/router";

//pages
import { LineStaticComponent} from "app/views/basic/line-static/line-static.component";
import { RawMaterialsComponent} from "app/views/basic/raw-materials/raw-materials.component";
import { ParametersComponent} from "app/views/basic/parameters/parameters.component";

import { OrdersComponent} from "app/views/order/orders/orders.component";
import { OrderRawMaterialsComponent} from "app/views/order/order-raw-materials/order-raw-materials.component";
import { ProductStaticComponent} from "app/views/order/product-static/product-static.component";

import { ProductionScheduleComponent} from "app/views/schedule/production-schedule/production-schedule.component";
import { RawMaterialDemandsComponent} from "app/views/schedule/raw-material-demands/raw-material-demands.component";
import { StorageAmountComponent} from "app/views/schedule/storage-amount/storage-amount.component";
import { UncoveredDemandsComponent} from "app/views/schedule/uncovered-demands/uncovered-demands.component";


import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
import {TopNavigationLayoutComponent} from "./components/common/layouts/topNavigationlayout.component";

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: '/schedule/production-schedule', pathMatch: 'full'},

  // App views
  {
    path: 'basic', component: BasicLayoutComponent,
    children: [
      {path: 'line-static', component: LineStaticComponent},
      {path: 'raw-materials', component: RawMaterialsComponent},
      {path: 'parameters', component: ParametersComponent}
    ]
  },
  {
    path: 'order', component: BasicLayoutComponent,
    children: [
      {path: 'orders', component: OrdersComponent},
      {path: 'order-raw-materials', component: OrderRawMaterialsComponent},
      {path: 'product-static', component: ProductStaticComponent}
    ]
  },
  {
    path: 'schedule', component: BasicLayoutComponent,
    children: [
      {path: 'production-schedule', component: ProductionScheduleComponent},
      {path: 'raw-material-demands', component: RawMaterialDemandsComponent},
      {path: 'storage-amount', component: StorageAmountComponent},
      {path: 'uncovered-demands', component: UncoveredDemandsComponent}
    ]
  },

  // Handle all other routes
  {path: '**',  redirectTo: '/schedule/production-schedule'}
];
