import { JwtHelperService } from '@auth0/angular-jwt';
import { _HttpClient } from '@core/services/http.client';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class LoginService {  
    
    constructor(private http: _HttpClient, private jwtHelper: JwtHelperService, private spinnerService: Ng4LoadingSpinnerService, private _message: NzMessageService, private router: Router) { }
    islogin(): boolean {
        const token = this.jwtHelper.tokenGetter();
        let islogin = false;
        try {
            islogin = !this.jwtHelper.isTokenExpired(token);
        } catch (e) {
            localStorage.removeItem('token');
            islogin = false;
        }
        return islogin;
    }

    logout(): Promise<any> {
        this.spinnerService.show();
        return new Promise((resolve, reject) => {
            this.http.get('logout')
                .subscribe((res: any) => {
                    this.spinnerService.hide();
                    localStorage.removeItem('token');
                    this.router.navigate(['login']);
                    resolve(res);
                }, (err: HttpErrorResponse) => {
                    this.spinnerService.hide();
                    if (err.error instanceof Error) {
                        this._message.create('error', err.error.message);
                    } else {
                        this._message.create('error', '系统异常，退出失败');
                    }
                    resolve(null);
                });
        });
    }
}
