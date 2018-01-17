import { Component, OnInit } from '@angular/core';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ParkingSpacesComponent } from 'app/routes/parkings/parking-spaces/parking-spaces.component';
import { ParkingSpaceOperateComponent } from 'app/routes/parkings/parking-spaces/parking-space-operate/parking-space-operate.component';

@Component({
  selector: 'app-parks',
  templateUrl: './parkings.component.html',
  providers: [ParkingsService, NzMessageService]
})
export class ParkingsComponent implements OnInit {
  constructor(private park: ParkingsService, private msg: NzMessageService, private modalService: NzModalService) {
  }
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  addModel: any;
  _title: string;
  reset() {
    this.refreshData(true);
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

  addParkingSpace(pid, pname) {
    const _title = '添加停车位（' + pname + '）';
    this.addModel = this.modalService.open({
      title: _title,
      content: ParkingSpaceOperateComponent,
      footer: false,
      closable: false,
      maskClosable: false,
      width: '80%',
      zIndex: 1100,
      componentParams: {
        pid: pid,
        has_list: false
      }
    });
  }

  closeAddModel(e) {
    this.addModel.destroy();
  }

  parkingSpaces(id, pname) {
    const subscription = this.modalService.open({
      title: pname + ' 停车位管理',
      content: ParkingSpacesComponent,
      maskClosable: false,
      width: '80%',
      footer: false,
      componentParams: {
        pid: id,
        pname: pname
      }
    });
  }

  ngOnInit() {
    this.refreshData();
  }
}
