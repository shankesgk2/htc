import { LoginService } from '@core/services/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from '@core/services/settings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { _HttpClient } from '@core/services/http.client';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Component({
  selector: 'app-pages-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  valForm: FormGroup;
  loginLoadding: boolean;

  constructor(public settings: SettingsService, private spinnerService: Ng4LoadingSpinnerService, private loginserv: LoginService, public _message: NzMessageService, private http: _HttpClient, fb: FormBuilder, private router: Router) {
    this.loginLoadding = false;
    this.valForm = fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
      remember_me: [null]
    });
  }
  ngOnInit(): void {    
    if (this.loginserv.islogin()) {
      this.router.navigate(['/']);
    }
  }

  submit(): Promise<any> {
    if (this.valForm.valid) {
      const value = {
        username: this.valForm.value.email,
        password: this.valForm.value.password,
        remember_me: [null]
      };
      this.loginLoadding = true;
      this.spinnerService.show();
      return new Promise((resolve, reject) => {
        this.http.post('login', value, {observe: 'response'})
          .subscribe((resp: any) => {
            this.spinnerService.hide();
            localStorage.setItem('token', resp.token);
            this.router.navigate(['dashboard']);
            resolve(resp);
          }, (err: HttpErrorResponse) => {
            this.loginLoadding = false;
            this.spinnerService.hide();
            if (err.error instanceof Error) {
              this._message.create('error', err.error.message);
            } else {
              this._message.create('error', '用户名或密码错误，登录失败');
            }
            resolve(null);
          });
      });
    }
  }
}
