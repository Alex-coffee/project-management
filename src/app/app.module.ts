import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {ROUTES} from "./app.routes";
import { AppComponent } from './app.component';
import { HTTP_BASE } from './config';

// App views
import {AppviewsModule} from "./views/appviews/appviews.module";

// App modules/components
import {LayoutsModule} from "./components/common/layouts/layouts.module";

import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import {ToastOptions} from 'ng2-toastr';
import { ToastrCustomOption } from 'app/options/ToastrCustomOption';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';
import { CustomFormsModule } from 'ng2-validation';
import { CalendarModule } from 'angular-calendar';
import { PeityModule } from 'app/components/charts/peity';
import { SelectModule } from 'ng-select';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NgxPaginationModule } from 'ngx-pagination';

import { ManagementComponent } from 'app/views/scenario/management/management.component';
import { CalendarComponent } from './views/scenario/calendar/calendar.component';

import { LineStaticComponent } from 'app/views/basic/line-static/line-static.component';
import { RawMaterialsComponent } from 'app/views/basic/raw-materials/raw-materials.component';
import { OrdersComponent } from 'app/views/basic/orders/orders.component';
import { OrderRawMaterialsComponent } from 'app/views/basic/order-raw-materials/order-raw-materials.component';

import { ParametersComponent } from 'app/views/schedule/parameters/parameters.component';
import { ProductionScheduleComponent } from 'app/views/schedule/production-schedule/production-schedule.component';
import { KpiComponent } from 'app/views/schedule/kpi/kpi.component';
import { RawMaterialDemandsComponent } from 'app/views/schedule/raw-material-demands/raw-material-demands.component';
import { StorageAmountComponent } from 'app/views/schedule/storage-amount/storage-amount.component';
import { UncoveredDemandsComponent } from 'app/views/schedule/uncovered-demands/uncovered-demands.component';
import { OrderScheduleComponent } from 'app/views/schedule/order-schedule/order-schedule.component';
import { GanttDirective } from 'app/directive/gantt.directive';

import { ProductStaticComponent } from 'app/views/production/product-static/product-static.component';
import { MaterialPurchasingComponent } from 'app/views/production/material-purchasing/material-purchasing.component';
import { MaterialCalendarComponent } from 'app/views/scenario/material-calendar/material-calendar.component';
import { OrderCalendarComponent } from 'app/views/scenario/order-calendar/order-calendar.component';

import { FormWizardComponent } from 'app/components/wizard/form-wizard.component';
import { WizardStepComponent } from 'app/components/wizard/wizard-step.component';

import { WizardComponent } from 'app/views/wizard/wizard.component';
import { LoginComponent} from 'app/views/login/login.component';

import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { OrderImportComponent } from './views/scenario/order-import/order-import.component';
import { ProductStaticImportComponent } from './views/scenario/product-static-import/product-static-import.component';
import { DataSheetDirective } from './directive/data-sheet.directive';

import { AuthGuard } from 'app/guards/auth.guard';
import { UsersComponent } from './views/admin/users/users.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from 'app/guards/token.interceptor';
import { ClockPickerDirective } from 'app/directive/clockpicker.directive';
import { DemandsCoveredBySafeStorageComponent } from './views/schedule/demands-covered-by-safe-storage/demands-covered-by-safe-storage.component';
import { InlineEditorModule } from 'ng2-inline-editor';
import { DemandsMeetViewComponent } from './views/schedule/demands-meet-view/demands-meet-view.component';
import { RawMaterialStorageComponent } from './views/schedule/raw-material-storage/raw-material-storage.component';
import { LineImportComponent } from './views/scenario/line-import/line-import.component';
import { ScheduleTableComponent } from './views/schedule/schedule-table/schedule-table.component';

const DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  maxFilesize: 1,
  acceptedFiles: '.csv'
};

@NgModule({
  declarations: [
    AppComponent,
    ManagementComponent,
    CalendarComponent,
    LineStaticComponent,
    RawMaterialsComponent,
    OrderRawMaterialsComponent,
    OrdersComponent,
    ProductStaticComponent,
    MaterialPurchasingComponent,
    MaterialCalendarComponent,
    OrderCalendarComponent,
    ParametersComponent,
    ProductionScheduleComponent,
    UncoveredDemandsComponent,
    KpiComponent,
    RawMaterialDemandsComponent,
    StorageAmountComponent,
    GanttDirective,
    FormWizardComponent,
    WizardStepComponent,
    WizardComponent,
    LoginComponent,
    OrderImportComponent,
    ProductStaticImportComponent,
    OrderScheduleComponent,
    DataSheetDirective,
    UsersComponent,
    ClockPickerDirective,
    DemandsCoveredBySafeStorageComponent,
    DemandsMeetViewComponent,
    RawMaterialStorageComponent,
    LineImportComponent,
    ScheduleTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    LayoutsModule,
    AppviewsModule,
    SelectModule,
    NgxPaginationModule,
    ChartsModule,
    InlineEditorModule,

    // ScenarioModule,
    // BasicModule,
    // OrderModule,
    // ScheduleModule,
    
    CustomFormsModule,
    DateValueAccessorModule,
    RouterModule.forRoot(ROUTES),
    DropzoneModule.forRoot(DROPZONE_CONFIG),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ToastModule.forRoot(),
    CalendarModule.forRoot(),
    PeityModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthGuard,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: ToastOptions, useClass: ToastrCustomOption},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
