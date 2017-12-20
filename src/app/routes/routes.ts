import { LayoutComponent } from '../layout/layout.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LoginComponent } from './pages/login/login.component';
import { LockComponent } from './pages/lock/lock.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../core/net/token/login.guard';
import { ParkingsComponent } from 'app/routes/parkings/parkings.component';
import { ParkingOperateComponent } from 'app/routes/parkings/parking-operate/parking-operate.component';

export const routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent, data: { title: '仪表盘' } },
            { path: 'admins', loadChildren: './admins/admins.module#AdminsModule', data: { title: '管理员' } },
            { path: 'parks', component: ParkingsComponent, data: { title: '停车场管理' } },
            { path: 'parks/operate', component: ParkingOperateComponent, data: { title: '停车场管理' } },
        ]
    },
    // 单页不包裹Layout
    { path: 'login', component: LoginComponent, data: { title: '登录' } },
    { path: 'lock', component: LockComponent, data: { title: '锁定' } },
    { path: '**', redirectTo: 'dashboard' }
];
