import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient } from '@core/services/http.client';
import { NzMessageService } from 'ng-zorro-antd';
import { TitleService } from '@core/services/title.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AmapGeocoderService, AmapGeocoderWrapper } from 'ngx-amap';
import china_division from '@shared/helper/cascader-address-options';

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
  public china_division = china_division;
  public search_division: any[] = [{
    value: '37',
    label: '山东省'
  }, {
    value: '3715',
    label: '聊城市'
  }, {
    value: '371502',
    label: '东昌府区'
  }];
  public search_area: any = '';
  private selected_area: object;
  public point: any;
  public locationInfo: string;
  private plugin: Promise<AmapGeocoderWrapper>;
  public location: string;
  constructor(private routeInfo: ActivatedRoute, private http: _HttpClient, private parksSvc: ParkingsService, private fb: FormBuilder, private msg: NzMessageService, private titleSvc: TitleService, private AmapGeocoder: AmapGeocoderService, public router: Router) {
    this.plugin = AmapGeocoder.of();
  }

  submitForm() {
    this._loading = true;
    this._loadingId = this.msg.loading('提交中...', { nzDuration: 0 }).messageId;
    if (this.form.valid) {
      const data = this.form.value;
      delete data.china_division;
      delete data.search_area;
      if (Array.isArray(this.point)) {
        data.longitude = this.point[0];
        data.latitude = this.point[1];
      } else {
        data.longitude = this.point.getLng();
        data.latitude = this.point.getLat();
      }
      return new Promise((resolve, reject) => {
        const a = this.http.post_patch('parking', this.id, data, { observe: 'response' })
          .subscribe((resp: HttpResponse<any>) => {
            this.msg.remove(this._loadingId);
            if (resp.status === 201) {
              this.msg.success(this.actionName + '成功');
              this.router.navigate(['/parks']);
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
  get principal() { return this.form.controls.principal; }
  get contact_information() { return this.form.controls.contact_information; }
  get location_form() { return this.form.controls.location; }
  get charges() { return this.form.controls.charges; }
  get free_time() { return this.form.controls.free_time; }
  get parking_spaces() { return this.form.controls.parking_spaces; }
  ngOnInit() {
    let barrier_gates_form = [];
    barrier_gates_form = [this.buildBarrier_gate()];
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      principal: null,
      contact_information: null,
      location: [null, Validators.required],
      charges: ['2.00', Validators.required],
      free_time: ['0', Validators.required],
      china_division: null,
      search_area: null,
      parking_spaces: ['1', Validators.required],
      barrier_gates: this.fb.array(barrier_gates_form)
    });
    this.id = this.routeInfo.snapshot.queryParams['id'];
    if (this.id) {
      this._loadingId = this.msg.loading('读取数据中...', { nzDuration: 0 }).messageId;
      this.actionName = '修改停车场';
      this.actionBtn = '修改';
      this.titleSvc.setTitle(this.actionName);
      const barrier_gates_field = <FormArray>this.form.controls['barrier_gates'];
      barrier_gates_field.removeAt(0);
      this.park = this.parksSvc.getPark(this.id).subscribe((data: any) => {
        this.form.patchValue({
          'name': data.name,
          'parking_spaces': data.parking_spaces,
          'charges': data.charges,
          'free_time': data.free_time,
          'location': data.location,
          'principal': data.principal,
          'contact_information': data.contact_information
        });
        for (const key in data.barrier_gates) {
          barrier_gates_field.push(this.buildBarrier_gate({
            'id': data.barrier_gates[key]['id'],
            'Bid': data.barrier_gates[key]['bid'],
            'Bname': data.barrier_gates[key]['bname'],
            'Btype': data.barrier_gates[key]['btype'],
            'Bdescription': data.barrier_gates[key]['bdescription']
          }));
        }
        this.point = [data.longitude, data.latitude];
        this.locationInfo = data.location;
        this.msg.remove(this._loadingId);
      }, (error: HttpErrorResponse) => {
        this._loading = true;
        this.actionBtn = '数据加载出错';
        this.msg.remove(this._loadingId);
      });
    }
  }

  buildBarrier_gate(val: any = []) {
    return this.fb.group({
      id: val.id ? val.id : '0',
      Bid: [val.Bid, Validators.required],
      Bname: [val.Bname, Validators.required],
      Btype: [val.Btype !== undefined ? String(val.Btype) : '1', Validators.required],
      Bdescription: val.Bdescription
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

  search_map(withKeyword = false) {
    let search_keyword = '';
    for (const area in this.selected_area) {
      search_keyword += this.selected_area[area].label;
    }
    if (withKeyword) {
      search_keyword += this.search_area || '';
    }
    if (search_keyword) {
      this.plugin.then(geocoder => geocoder.getLocation(search_keyword))
        .then(data => {
          if (data.status === 'complete' && data.result.info === 'OK') {
            this.point = data.result.geocodes[0].location;
            this.locationInfo = data.result.geocodes[0].formattedAddress;
          }
        });
    }
  }

  onMapClick(e) {
    this.point = e.lnglat;
    if (this.point) {
      this.plugin.then(geocoder => geocoder.getAddress(this.point))
        .then(data => {
          if (data.status === 'complete' && data.result.info === 'OK') {
            this.location = data.result.regeocode.formattedAddress;
            this.locationInfo = this.location;
          }
        });
    }
  }

  _set_selected_area(value) {
    this.selected_area = value;
    if (value.length > 1) {
      this.search_map(true);
    } else {
      this.search_map();
    }
  }
}
