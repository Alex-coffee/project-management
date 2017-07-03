import {Routes} from "@angular/router";

import {Dashboard1Component} from "./views/dashboards/dashboard1.component";
import {Dashboard2Component} from "./views/dashboards/dashboard2.component";
import {Dashboard3Component} from "./views/dashboards/dashboard3.component";
import {Dashboard4Component} from "./views/dashboards/dashboard4.component";
import {Dashboard41Component} from "./views/dashboards/dashboard41.component";
import {Dashboard5Component} from "./views/dashboards/dashboard5.component";

import {OrdersComponent} from "app/views/processManagement/orders/orders.component";
import {LineStaticComponent} from "app/views/processManagement/line-static/line-static.component";
import {ProductStaticComponent} from "app/views/processManagement/product-static/product-static.component";
import {StorageAmountComponent} from "app/views/processManagement/storage-amount/storage-amount.component";
import {UncoveredDemandsComponent} from "app/views/processManagement/uncovered-demands/uncovered-demands.component";

import {ProcessResultComponent} from "./views/processManagement/process-result/process-result.component";


import {StarterViewComponent} from "./views/appviews/starterview.component";
import {LoginComponent} from "./views/appviews/login.component";

import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
import {TopNavigationLayoutComponent} from "./components/common/layouts/topNavigationlayout.component";

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'process-result', pathMatch: 'full'},

  // App views
  {
    path: 'dashboards', component: BasicLayoutComponent,
    children: [
      {path: 'dashboard1', component: Dashboard1Component},
      {path: 'dashboard2', component: Dashboard2Component},
      {path: 'dashboard3', component: Dashboard3Component},
      {path: 'dashboard4', component: Dashboard4Component},
      {path: 'dashboard5', component: Dashboard5Component}
    ]
  },
  {
    path: 'processManagement', component: BasicLayoutComponent,
    children: [
      {path: 'orders', component: OrdersComponent},
      {path: 'line-static', component: LineStaticComponent},
      {path: 'product-static', component: ProductStaticComponent},
      {path: 'storage-amount', component: StorageAmountComponent},
      {path: 'uncovered-demands', component: UncoveredDemandsComponent},
    ]
  },
  {
    path: '', component: BasicLayoutComponent,
    children: [
      {path: 'process-result', component: ProcessResultComponent}
    ]
  },
  {
    path: '', component: BlankLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
    ]
  },

  // Handle all other routes
  {path: '**',  redirectTo: 'process-result'}
];
