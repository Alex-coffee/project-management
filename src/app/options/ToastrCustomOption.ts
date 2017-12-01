import {ToastOptions} from 'ng2-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class ToastrCustomOption extends ToastOptions {
    animate = 'flyRight'; // you can override any options available
    newestOnTop = true;
    showCloseButton = true;
}