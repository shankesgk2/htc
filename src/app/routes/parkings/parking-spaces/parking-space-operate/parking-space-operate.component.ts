import { Component, OnInit } from '@angular/core';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@core/services/http.client';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parking-space-operate',
  templateUrl: './parking-space-operate.component.html',
  styles: []
})
export class ParkingSpaceOperateComponent implements OnInit {
  public has_list: boolean;
  public id: number;
  private pid: number;
  private rid_value: string;
  private parking_lock_value: string;
  private status_value: string;
  private remark_value: string;
  public form: FormGroup;
  public _loading = false;
  public _loadingId;
  public closeBtnDisable = false;
  actionName = '添加';
  constructor(
    private subject: NzModalSubject,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private http: _HttpClient,
    private routeInfo: ActivatedRoute
  ) { }

  submitParkingSpaceForm() {
    this._loading = true;
    this.closeBtnDisable = true;
    this._loadingId = this.msg.loading(this.actionName + '提交中...', { nzDuration: 0 }).messageId;
    if (this.form.valid) {
      const data = this.form.value;
      data.pid = this.pid;
      return new Promise((resolve, reject) => {
        const a = this.http.post_patch('parkingspace', this.id, data, { observe: 'response' })
          .subscribe((resp: HttpResponse<any>) => {
            this._loading = false;
            this.closeBtnDisable = false;
            this.msg.remove(this._loadingId);
            if (resp.status === 201) {
              if (this.has_list) {
                this.subject.next('refreshData');
              }
              this.closeParkingSpaceOperateModel();
              this.msg.success(this.actionName + '成功');
            }
            resolve(resp);
            return true;
          }, (error: HttpErrorResponse) => {
            this._loading = false;
            this.closeBtnDisable = false;
            this.msg.remove(this._loadingId);
          });
      });
    } else {
      this.msg.error('请检查表单是否填写完整');
    }
  }

  closeParkingSpaceOperateModel() {
    this.subject.destroy();
  }

  buildParking_space(val: any = []) {
    return this.fb.group({
      rid: [null, Validators.required],
      parking_lock: [null, Validators.required],
      status: [0, Validators.required],
      remark: null
    });
  }

  addParking_space() {
    const control = <FormArray>this.form.controls['parking_spaces'];
    control.push(this.buildParking_space());
  }

  removeParking_space(i: number) {
    const control = <FormArray>this.form.controls['parking_spaces'];
    control.removeAt(i);
  }

  get parking_spaces() { return this.form.controls.parking_spaces; }
  get rid() { return this.form.controls.rid; }
  get parking_lock() { return this.form.controls.parking_lock; }
  get status() { return this.form.controls.status; }
  get remark() { return this.form.controls.remark; }

  ngOnInit() {
    let parking_spaces_form = [];
    parking_spaces_form = [this.buildParking_space()];
    if (this.id) {
      this.form = this.fb.group({
        rid: [this.rid_value, Validators.required],
        parking_lock: [this.parking_lock_value, Validators.required],
        status: [this.status_value, Validators.required],
        remark: this.remark_value,
      });
    } else {
      this.form = this.fb.group({
        parking_spaces: this.fb.array(parking_spaces_form)
      });
    }
    if (this.id) {
      this.actionName = '修改';
    } else {
      this.actionName = '添加';
    }
  }
}
