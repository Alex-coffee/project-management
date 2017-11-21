import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { smoothlyMenu } from '../../../app.helpers';
import { ModalDirective } from 'ngx-bootstrap';
declare var jQuery:any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html'
})
export class TopNavbarComponent {
  @ViewChild('logoutModal') public logoutModal: ModalDirective;
  constructor(private router: Router) {}

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }

  confirmLogout() {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.logoutModal.hide();
  }


}
