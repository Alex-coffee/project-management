import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    const req = request.clone({ headers: request.headers.set('authorization', '' + token)});

    return next.handle(req);
  }

  getToken(): String {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
        const currentUser = JSON.parse(userStr);
        return currentUser.token;
    } else {
        return '';
    }
  }
}
