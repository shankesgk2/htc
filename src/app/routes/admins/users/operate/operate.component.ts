import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { UsersService } from 'app/routes/admins/users/users.services';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@core/services/http.client';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TitleService } from '@core/services/title.service';

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  providers: [UsersService, NzMessageService],
})
export class OperateComponent implements OnInit {
  public form: FormGroup;
  private id;
  public _loading = false;
  private _loadingId;
  public actionName = '添加管理员';
  public actionBtn = '添加';
  public pwPlaceHolder = '不修改密码请留空';
  public user: any;
  constructor(private routeInfo: ActivatedRoute, private http: _HttpClient, private userSvc: UsersService, private fb: FormBuilder, private msg: NzMessageService, private titleSvc: TitleService) { }

  submitForm(): Promise<any> {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
    }

    this._loading = true;
    this._loadingId = this.msg.loading('提交中...', { nzDuration: 0 }).messageId;
    if (this.form.valid) {
      return new Promise((resolve, reject) => {
        const a = this.http.post_patch('admin', this.id, this.form.value, { observe: 'response' })
          .subscribe((resp: HttpResponse<any>) => {
            this._loading = false;
            this.msg.remove(this._loadingId);
            if (resp.status === 201) {
              this.msg.success(this.actionName + '成功');
            }
            resolve(resp);
            return true;
          }, (error: HttpErrorResponse) => {           
            this._loading = false;
            this.msg.remove(this._loadingId);
          });
      });
    } else {
      this.msg.error('请检查表单是否填写完整');
    }
  }

  confirmationValidator(reverse: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.form === null || this.form === undefined) return;
      const cp = this.form.controls['password_confirmation'].value;
      const p = this.form.controls['password'].value;

      if (cp === '' && p === '') {
        this.form.controls['password_confirmation'].setErrors(null);
        return;
      }
      const checked = cp === p ? true : false;
      if (p) {
        this.form.controls['password_confirmation'].setErrors({ required: true });
      }
      if (!reverse) {
        return checked ? null : { checked: true };
      } else if (reverse && cp) {
        if (!checked) {
          this.form.controls['password_confirmation'].setErrors({ checked: true });
        } else {
          this.form.controls['password_confirmation'].setErrors(null);
        }
        return;
      }
    };
  }

  get email() { return this.form.controls.email; }
  get name() { return this.form.controls.name; }
  get password() { return this.form.controls.password; }
  get password_confirmation() { return this.form.controls.password_confirmation; }
  get truename() { return this.form.controls.truename; }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email]],
      truename: [null, [Validators.required]],
      password: [null, this.confirmationValidator(true)],
      password_confirmation: [null, this.confirmationValidator(false)]
    });
    this.id = this.routeInfo.snapshot.queryParams['id'];
    if (this.id) {
      this.actionName = '修改管理员';
      this.actionBtn = '修改';
      this.pwPlaceHolder = '不修改密码请留空';
      this.user = this.userSvc.getUser(this.id).subscribe((data: any) => {
        this.form.patchValue({
          'name': data.name,
          'truename': data.truename,
          'email': data.email
        });
      });
    } else {
      this.pwPlaceHolder = '请填写密码';
      this.form.controls['password'].setValidators([Validators.required, this.confirmationValidator(true)]);
    }
    this.titleSvc.setTitle(this.actionName);
  }
  getFormControl(name: string) {
    return this.form.controls[name];
  }
}
