import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { routes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParkingsComponent } from './parkings/parkings.component';
import { ParkingOperateComponent } from 'app/routes/parkings/parking-operate/parking-operate.component';
import { ParkingSpacesComponent } from 'app/routes/parkings/parking-spaces/parking-spaces.component';
import { ParkingSpaceOperateComponent } from 'app/routes/parkings/parking-spaces/parking-space-operate/parking-space-operate.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: true }),
        PagesModule
    ],
    declarations: [
        DashboardComponent,
        ParkingsComponent,
        ParkingOperateComponent,
        ParkingSpacesComponent,
        ParkingSpaceOperateComponent
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [
        ParkingSpacesComponent,
        ParkingSpaceOperateComponent
    ]
})

export class RoutesModule { }
