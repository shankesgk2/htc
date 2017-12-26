import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private routeInfo: ActivatedRoute, private http: _HttpClient, private parksSvc: ParkingsService, private fb: FormBuilder, private msg: NzMessageService, private titleSvc: TitleService, private AmapGeocoder: AmapGeocoderService) {
    this.plugin = AmapGeocoder.of();
  }

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
      location: [null, Validators.required],
      china_division: null,
      search_area: null,
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
          console.log('get location of address:', search_keyword);
          console.log('status:', data.status);
          console.log('result:', data.result);

          if (data.status === 'complete' && data.result.info === 'OK') {
            this.point = data.result.geocodes[0].location;
            this.locationInfo = data.result.geocodes[0].formattedAddress;
          }
        });
    }
  }

  onMapClick(e) {
    this.point = e.lnglat;
    this.locationInfo = `经纬度： ${this.point.getLng()}, ${this.point.getLat()}`;

    if (this.point) {
      // 使用AMap.Geocoder.getAddress方法逆向地理编码:
      this.plugin.then(geocoder => geocoder.getAddress(this.point))
        .then(data => {
          console.log('get address of position:', this.point);
          console.log('status:', data.status);
          console.log('result:', data.result);

          if (data.status === 'complete' && data.result.info === 'OK') {
            this.location = data.result.regeocode.formattedAddress;
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
