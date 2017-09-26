import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BsDropdownModule} from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';

import {BasicLayoutComponent} from "./basicLayout.component";
import {BlankLayoutComponent} from "./blankLayout.component";
import {TopNavigationLayoutComponent} from "./topNavigationlayout.component";
import { DateValueAccessorModule } from 'angular-date-value-accessor';

import {NavigationComponent} from "./../navigation/navigation.component";
import {FooterComponent} from "./../footer/footer.component";
import {TopNavbarComponent} from "./../topnavbar/topnavbar.component";
import {TopNavigationNavbarComponent} from "./../topnavbar/topnavigationnavbar.component";
import { ScenarioModalComponent } from 'app/components/modal/scenario-modal/scenario-modal.component';

@NgModule({
  declarations: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent,
    ScenarioModalComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    BrowserModule,
    RouterModule,
    DateValueAccessorModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  exports: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    TopNavigationLayoutComponent,
    TopNavbarComponent,
    TopNavigationNavbarComponent
  ],
})

export class LayoutsModule {}
