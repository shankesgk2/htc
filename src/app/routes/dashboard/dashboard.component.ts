import { NzMessageService } from 'ng-zorro-antd';
import { Component } from '@angular/core';
import { _HttpClient } from '@core/services/http.client';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    constructor(private http: _HttpClient, private router: Router) {
        this.http.get('dashboard', {observe: 'response'})
        .subscribe((resp: any) => {
          console.log('asdf');
        });
      }
    
}
