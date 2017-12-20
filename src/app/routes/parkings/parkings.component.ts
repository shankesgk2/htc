import { Component, OnInit } from '@angular/core';
import { ParkingsService } from 'app/routes/parkings/parkings.service';

@Component({
  selector: 'app-parks',
  templateUrl: './parkings.component.html',
  providers: [ParkingsService]
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

  constructor(private park: ParkingsService) {
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
  deletePark() {
    
  }

  ngOnInit() {
    this.refreshData();
  }
}
