import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
@Injectable()
export class UsersService {

  getUsers(pageIndex = 1, pageSize = 10) {
    const params = new HttpParams()
      .append('page', `${pageIndex}`)
      .append('results', `${pageSize}`);
    return this.http.get('admin', {
      params: params
    });
  }

  getUser(id = 0) {
    return this.http.get('admin/' + id);
  }
  constructor(private http: HttpClient) {}
}
