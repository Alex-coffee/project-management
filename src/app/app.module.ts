import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {ToastOptions} from 'ng2-toastr';
import { ToastrCustomOption } from 'app/options/ToastrCustomOption';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    LayoutsModule,
    AppviewsModule,

    BasicModule,
    OrderModule,
    ScheduleModule,
    RouterModule.forRoot(ROUTES),
    ModalModule.forRoot(),
    ToastModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: ToastOptions, useClass: ToastrCustomOption},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
