import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AsyncValidatorFn, AbstractControl, ValidatorFn } from '@angular/forms';
import { UsersService } from 'app/routes/admins/users/users.services';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs/Observable';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { map, delay, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-operate',
  templateUrl: './operate.component.html',
  providers: [UsersService, NzMessageService],
  styleUrls: ['./operate.component.less']
})
export class OperateComponent implements OnInit {
  public form: FormGroup;
  private id;
  public actionName: String = '添加管理员';
  public actionBtn: String = '添加';
  public pwPlaceHolder: String = '不修改密码请留空';
  public user: any;
  constructor(private routeInfo: ActivatedRoute, private userSvc: UsersService, private fb: FormBuilder, private msg: NzMessageService) { }

  submitForm() {
    // tslint:disable-next-line:forin
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
    }
    console.log('log', this.form.value);
    if (this.form.valid) {
      console.log('log', this.form.controls['password'].value);
      this.msg.success('Successed!');
    } else {
      this.msg.error('Fail!');
    }
  }

  confirmationValidator(reverse: boolean = false): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.form === null || this.form === undefined) return;
      const cp = this.form.controls['checkPassword'].value;
      const p = this.form.controls['password'].value;

      if (cp === '' && p === '') {
        this.form.controls['checkPassword'].setErrors(null);
        return;
      }
      const checked = cp === p ? true : false;
      if (p) {
        this.form.controls['checkPassword'].setErrors({ required: true });
      }
      if (!reverse) {
        return checked ? null : { checked: true };
      } else if (reverse && cp) {
        if (!checked) {
          this.form.controls['checkPassword'].setErrors({ checked: true });
        } else {
          this.form.controls['checkPassword'].setErrors(null);
        }
        return;
      }
    };
  }
  // confirmationValidator = (control: FormControl, reverse: boolean = false): { [key: string]: boolean } => {
  //   if (this.form === null || this.form === undefined) return;
  //   // console.log(this.form.controls['checkPassword'].value === this.form.controls['password'].value);

  //   console.log('log', control.value);
  //   const checked = this.form.controls['checkPassword'].value === this.form.controls['password'].value ? true : false;
  //   if (!reverse) {
  //     console.log('log', '焦点在重复密码');
  //     return checked ? null : { checked: true };
  //   } else if (reverse && this.form.controls['checkPassword'].value) {
  //     console.log('log', '焦点在密码');
  //     if (!checked) {
  //       console.log('log', '焦点在密码，验证未通过');
  //       this.form.controls['checkPassword'].setErrors({ checked: true });
  //     }
  //     console.log('\r\n');
  //     return;
  //   }
  // }

  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get checkPassword() { return this.form.controls.checkPassword; }
  get truename() { return this.form.controls.truename; }

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.email]],
      truename: [null, [Validators.required]],
      password: [null, this.confirmationValidator(true)],
      checkPassword: [null, this.confirmationValidator(false)]
    });
    this.id = this.routeInfo.snapshot.queryParams['id'];
    if (this.id) {
      this.actionName = '修改管理员';
      this.actionBtn = '修改';
      this.pwPlaceHolder = '不修改密码请留空';
      this.user = this.userSvc.getUser(this.id).subscribe((data: any) => {
        this.form.setValue({
          'truename': data.truename,
          'email': data.email,
          'password': '',
          'checkPassword': ''
        });
      });
    } else {
      this.pwPlaceHolder = '请填写密码';
      this.form.controls['password'].setValidators([Validators.required, this.confirmationValidator(true)]);
    }
  }
  getFormControl(name: string) {
    return this.form.controls[name];
  }
}
