import { Component, OnInit } from '@angular/core';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-parks',
  templateUrl: './parkings.component.html',
  providers: [ParkingsService, NzMessageService]
})
export class ParkingsComponent implements OnInit {

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;

  reset() {
    this.refreshData(true);
  }

  constructor(private park: ParkingsService, private msg: NzMessageService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.park.getParks(this._current, this._pageSize).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.data;
    });


  }
  deleteParking(id) {
    this._loading = true;
    this.park.deleteParking(id).subscribe((data: any) => {
      this._loading = false;
      this.msg.success('删除成功');
      this.refreshData();
    }, (error: HttpErrorResponse) => {
        this._loading = false;
        this.msg.error('删除失败');
    });
  }

  ngOnInit() {
    this.refreshData();
  }
}
