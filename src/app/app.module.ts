import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import {ROUTES} from "./app.routes";
import { AppComponent } from './app.component';

// App views
import {DashboardsModule} from "./views/dashboards/dashboards.module";
import {AppviewsModule} from "./views/appviews/appviews.module";
import {ProcessManagementViewModule} from "./views/processManagement/processManagement.views.module";
import {MaterialsModule} from "./views/materials/materials.module";

import {BasicModule} from "./views/basic/basic.module";
import {OrderModule} from "./views/order/order.module";
import {ScheduleModule} from "./views/schedule/schedule.module";


// App modules/components
import {LayoutsModule} from "./components/common/layouts/layouts.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LayoutsModule,
    AppviewsModule,

    BasicModule,
    OrderModule,
    ScheduleModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
