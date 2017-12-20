import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { routes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParkingsComponent } from './parkings/parkings.component';
import { ParkingOperateComponent } from 'app/routes/parkings/parking-operate/parking-operate.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: true }),
        PagesModule
    ],
    declarations: [
        DashboardComponent,
        ParkingsComponent,
        ParkingOperateComponent
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule { }
