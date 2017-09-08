import {Routes} from "@angular/router";

//pages
import { LineStaticComponent} from "app/views/basic/line-static/line-static.component";
import { RawMaterialsComponent} from "app/views/basic/raw-materials/raw-materials.component";
import { OrdersComponent} from "app/views/basic/orders/orders.component";
import { OrderRawMaterialsComponent} from "app/views/basic/order-raw-materials/order-raw-materials.component";

import { ManagementComponent} from "app/views/scenario/management/management.component";
import { CalendarComponent} from "app/views/scenario/calendar/calendar.component";
import { MaterialCalendarComponent } from 'app/views/scenario/material-calendar/material-calendar.component';
import { OrderCalendarComponent } from 'app/views/scenario/order-calendar/order-calendar.component';

import { ProductStaticComponent} from "app/views/production/product-static/product-static.component";
import { MaterialPurchasingComponent} from "app/views/production/material-purchasing/material-purchasing.component";

import { ParametersComponent} from "app/views/schedule/parameters/parameters.component";
import { ProductionScheduleComponent} from "app/views/schedule/production-schedule/production-schedule.component";
import { RawMaterialDemandsComponent} from "app/views/schedule/raw-material-demands/raw-material-demands.component";
import { StorageAmountComponent} from "app/views/schedule/storage-amount/storage-amount.component";
import { UncoveredDemandsComponent} from "app/views/schedule/uncovered-demands/uncovered-demands.component";
import { KpiComponent} from "app/views/schedule/kpi/kpi.component";


import {BlankLayoutComponent} from "./components/common/layouts/blankLayout.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
import {TopNavigationLayoutComponent} from "./components/common/layouts/topNavigationlayout.component";

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: '/scenario/management', pathMatch: 'full'},

  // App views
  {
    path: 'scenario', component: BasicLayoutComponent,
    children: [
      {path: 'management', component: ManagementComponent},
      {path: 'calendar', component: CalendarComponent},
      {path: 'material-calendar', component: MaterialCalendarComponent},
      {path: 'order-calendar', component: OrderCalendarComponent}
    ]
  },
  {
    path: 'basic', component: BasicLayoutComponent,
    children: [
      {path: 'line-static', component: LineStaticComponent},
      {path: 'raw-materials', component: RawMaterialsComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'product-raw-materials', component: OrderRawMaterialsComponent}
    ]
  },
  {
    path: 'production', component: BasicLayoutComponent,
    children: [
      {path: 'material-purchasing', component: MaterialPurchasingComponent},
      {path: 'product-static', component: ProductStaticComponent}
    ]
  },
  {
    path: 'schedule', component: BasicLayoutComponent,
    children: [
      {path: 'parameters', component: ParametersComponent},
      {path: 'production-schedule', component: ProductionScheduleComponent},
      {path: 'kpi', component: KpiComponent},
      {path: 'raw-material-demands', component: RawMaterialDemandsComponent},
      {path: 'storage-amount', component: StorageAmountComponent},
      {path: 'uncovered-demands', component: UncoveredDemandsComponent}
    ]
  },

  // Handle all other routes
  {path: '**',  redirectTo: '/scenario/management'}
];
