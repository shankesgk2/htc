import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { _HttpClient } from '@core/services/http.client';

@Injectable()
export class ParkingsService {

    getParks(pageIndex = 1, pageSize = 10) {
        const params = {
            'page': pageIndex,
            'results': pageSize
        };
        return this.http.get('parking', {
            params: params
        });
    }

    getReservations(pid, with_parking, pageIndex = 1, pageSize = 10) {
        const params = {
            'page': pageIndex,
            'results': pageSize,
            'pid': pid,
            'withparking': with_parking
        };
        return this.http.get('parkingspace', {
            params: params
        });
    }
    getPark(id = 0) {
        return this.http.get('parking/' + id);
    }

    deleteParking(id) {
        return this.http.delete('parking/' + id);
    }
    constructor(private http: _HttpClient) { }
}
