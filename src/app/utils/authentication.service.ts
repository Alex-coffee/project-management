import { Injectable } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_BASE } from 'app/config';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    private HOST:string = HTTP_BASE;
    public token: string;

    constructor(private http: HttpClient) {
        // set token if saved in local storage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
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

    login(username: string, password: string) {
        return this.http.post(this.HOST + '/login', { name: username, pwd: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response && response['token'];
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(response));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        sessionStorage.removeItem('currentUser');
    }
}