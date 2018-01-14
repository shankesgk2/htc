import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzModalService } from 'ng-zorro-antd';
import { ParkingsService } from 'app/routes/parkings/parkings.service';
import { ParkingSpaceOperateComponent } from 'app/routes/parkings/parking-spaces/parking-space-operate/parking-space-operate.component';

@Component({
  selector: 'app-parking-spaces',
  templateUrl: './parking-spaces.component.html',
  providers: [ParkingsService]
})
export class ParkingSpacesComponent implements OnInit {
  constructor(
    private subject: NzModalSubject,
    private park: ParkingsService,
    private modalService: NzModalService
  ) { }
  id: number;
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
    this.park.getReservations(this.id, false, this._current, this._pageSize).subscribe((data: any) => {
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.data;
    });
  }

  addParkingSpace(e) {
    const _title = '添加停车位（' + this.pname + '）';
    this.addModel = this.modalService.open({
      title: _title,
      content: ParkingSpaceOperateComponent,
      footer: false,
      maskClosable: false,
      width: 600,
      zIndex: 1100,
      componentParams: {
        id: this.id
      }
    });
  }
  closeParkingSpaceModel(e) {
    this.subject.destroy();
  }
  ngOnInit() {
    this.refreshData();
    this.subject.next();
  }
}
