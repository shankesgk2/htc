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

  constructor(private user: UsersService) {
  }

  refreshData(reset = false) {
    if (reset) {
      this._current = 1;
    }
    this._loading = true;
    this.user.getUsers(this._current, this._pageSize).subscribe((data: any) => {
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
