import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { _HttpClient } from '@core/services/http.client';

@Injectable()
export class ParkingsService {

    getParks(pageIndex = 1, pageSize = 10) {
        const params = new HttpParams()
            .append('page', `${pageIndex}`)
            .append('results', `${pageSize}`);
        return this.http.get('admin', {
            params: params
        });
    }

    getPark(id = 0) {
        return this.http.get('admin/' + id);
    }
    constructor(private http: _HttpClient) { }
}
