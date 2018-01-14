import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzModalService } from 'ng-zorro-antd';
import { ParkingsService } from 'app/routes/parkings/parkings.service';

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

  closeParkingSpaceModel(e) {
    this.subject.destroy();
  }
  ngOnInit() {
    this.refreshData();
    this.subject.next();
  }
}
