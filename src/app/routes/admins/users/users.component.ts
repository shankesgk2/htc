import { Component, OnInit } from '@angular/core';
import { UsersService } from 'app/routes/admins/users/users.services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [ UsersService ],
  styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

  _current = 1;
  _pageSize = 10;
  _total = 1;
  _dataSet = [];
  _loading = true;

  reset() {
    this.refreshData(true);
  }

  constructor(private _randomUser: UsersService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    // const selectedGender = this._filterGender.filter(item => item.value).map(item => item.name);
    this._randomUser.getUsers(this._current, this._pageSize).subscribe((data: any) => {
      console.log(data);
      this._loading = false;
      this._total = data.total;
      this._dataSet = data.data;
    });


  }
  deleteAdmin() {
    
  }

  ngOnInit() {
    this.refreshData();
  }

}
