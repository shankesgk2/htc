import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ParkingSpaceOperateComponent } from 'app/routes/parkings/parking-spaces/parking-space-operate/parking-space-operate.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-parking-spaces',
  templateUrl: './parking-spaces.component.html',
  providers: [ParkingsService]
})
export class ParkingSpacesComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private park: ParkingsService,
    private modalService: NzModalService,
    private msg: NzMessageService
  ) {

  }
  pid: number;
  pname: string;
  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;
  addModel: any;
  @Input()

  reset() {
    this.refreshData(true);
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.park.getReservations(this.pid, false, this._current, this._pageSize).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.data;
    });
  }

  editParkingSpace(id, rid, parking_lock, status, remark) {
    const _title = '修改停车位（' + this.pname + '）';
    this.addModel = this.modalService.open({
      title: _title,
      content: ParkingSpaceOperateComponent,
      footer: false,
      closable: false,
      maskClosable: false,
      width: '80%',
      zIndex: 1100,
      componentParams: {
        id: id,
        pid: this.pid,
        rid_value: rid,
        parking_lock_value: parking_lock,
        status_value: status,
        remark_value: remark,
        has_list: true
      }
    });
    this.addModel.subscribe(result => {
      if (result === 'refreshData') {
        this.refreshData();
      }
    });
  }

  addParkingSpace() {
    const _title = '添加停车位（' + this.pname + '）';
    this.addModel = this.modalService.open({
      title: _title,
      content: ParkingSpaceOperateComponent,
      footer: false,
      closable: false,
      maskClosable: false,
      width: '80%',
      zIndex: 1100,
      componentParams: {
        pid: this.pid,
        has_list: true
      }
    });

    this.addModel.subscribe(result => {
      if (result === 'refreshData') {
        this.refreshData(true);
      }
    });
  }

  deleteParkingSpace(id) {
    this._loading = true;
    this.park.deleteParkingSpace(id).subscribe((data: any) => {
      this._loading = false;
      this.msg.success('删除成功');
      this.refreshData();
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this._loading = false;
      if (error.error.message) {
        this.msg.error(error.error.message);
      } else {
        this.msg.error('删除失败');
      }
    });
  }

  closeParkingSpaceModel() {
    this.subject.destroy();
  }

  ngOnInit() {
    this.refreshData();
  }
}
