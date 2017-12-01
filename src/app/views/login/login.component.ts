import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { AuthenticationService } from 'app/utils/authentication.service';

@Component({
    //moduleId: module.id,
    templateUrl: 'login.component.html',
    providers: [AuthenticationService]
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        let pwd = Md5.hashStr(this.model.password);
        this.authenticationService.login(this.model.username, pwd.toString())
            .subscribe(result => {
                this.loading = false;
                if (result === true) {
                    this.router.navigate(['/']);
                } else {
                    this.error = '用户名或密码错误';
                    this.loading = false;
                }
            }, err => {
                this.loading = false;
                this.error = err.error;
            });
    }
}
