import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { ManagementComponent } from 'app/views/scenario/management/management.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import {ConfirmationPopoverModule} from 'angular-confirmation-popover';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot()
  ],
  declarations: [ManagementComponent]
})
export class ScenarioModule { }
