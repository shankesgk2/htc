import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@core/services/settings.service';
import { LoginService } from '@core/services/login.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  constructor(public settings: SettingsService, public msgSrv: NzMessageService, public loginserv: LoginService) {
  }

  logout(): Promise<any> {
    return this.loginserv.logout();
  }
}
