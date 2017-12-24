import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@core/services/http.client';
import { NzMessageService } from 'ng-zorro-antd';
import { TitleService } from '@core/services/title.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-park-operate',
  templateUrl: './parking-operate.component.html',
  providers: [ParkingsService]
})
export class ParkingOperateComponent implements OnInit {
  public form: FormGroup;
  private id;
  public actionName = '添加停车场';
  public actionBtn = '添加';
  public _loading = false;
  private _loadingId;
  public park: any;
  constructor(private routeInfo: ActivatedRoute, private http: _HttpClient, private parksSvc: ParkingsService, private fb: FormBuilder, private msg: NzMessageService, private titleSvc: TitleService) { }

  submitForm() {
    this._loading = true;
    this._loadingId = this.msg.loading('提交中...', { nzDuration: 0 }).messageId;
    if (this.form.valid) {
      return new Promise((resolve, reject) => {
        const a = this.http.post_patch('parking', this.id, this.form.value, { observe: 'response' })
          .subscribe((resp: HttpResponse<any>) => {
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
  get name() { return this.form.controls.name; }
  get barrier_gates() { return this.form.controls.barrier_gates; }
  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      principal: null,
      contact_information: null,
      location: null,
      barrier_gates: this.fb.array([
        this.buildBarrier_gate()
      ])
    });
    this.id = this.routeInfo.snapshot.queryParams['id'];
    if (this.id) {
      this.actionName = '修改停车场';
      this.actionBtn = '修改';
      this.park = this.parksSvc.getPark(this.id).subscribe((data: any) => {
        this.form.patchValue({
          'name': data.name,
          'barrier_gate': data.barrier_gate
        });
      });
    }
    this.titleSvc.setTitle(this.actionName);
  }

  buildBarrier_gate(val: string = null) {
    return this.fb.group({
      Bid: [null, Validators.required],
      Bname: [val, Validators.required],
      Bdescription: ''
    });
  }

  addBarrier_gate() {
    const control = <FormArray>this.form.controls['barrier_gates'];
    control.push(this.buildBarrier_gate());
  }

  removeBarrier_gate(i: number) {
    const control = <FormArray>this.form.controls['barrier_gates'];
    control.removeAt(i);
  }
}
