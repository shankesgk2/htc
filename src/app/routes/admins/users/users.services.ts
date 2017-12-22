import { Injectable } from '@angular/core';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { _HttpClient } from '@core/services/http.client';
@Injectable()
export class UsersService {

  getUsers(pageIndex = 1, pageSize = 10) {
    const params = {
      'page': pageIndex,
      'results': pageSize
    };
    return this.http.get('admin', {
      params: params
    });
  }

  getUser(id = 0) {
    return this.http.get('admin/' + id);
  }
  constructor(private http: _HttpClient) { }
}
