import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ActivatedRoute } from '@angular/router';
import { _HttpClient } from '@core/services/http.client';
import { NzMessageService } from 'ng-zorro-antd';
import { TitleService } from '@core/services/title.service';

@Component({
  selector: 'app-park-operate',
  templateUrl: './parking-operate.component.html',
  styles: []
})
export class ParkingOperateComponent implements OnInit {
  public form: FormGroup;
  private id;
  public actionName = '添加停车场';
  public actionBtn = '添加';
  public park: any;
  constructor(private routeInfo: ActivatedRoute, private http: _HttpClient, private userSvc: ParkingsService, private fb: FormBuilder, private msg: NzMessageService, private titleSvc: TitleService) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.email]],
      truename: [null, [Validators.required]],
    });
    this.id = this.routeInfo.snapshot.queryParams['id'];
    if (this.id) {
      this.actionName = '修改停车场';
      this.actionBtn = '修改';
      this.park = this.userSvc.getPark(this.id).subscribe((data: any) => {
        this.form.patchValue({
          'name': data.name,
          'truename': data.truename,
          'email': data.email
        });
      });
    }
    this.titleSvc.setTitle(this.actionName);
  }

}
