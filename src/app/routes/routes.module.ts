import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { PagesModule } from './pages/pages.module';

import { routes } from './routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParksComponent } from './parks/parks.component';
import { ParkOperateComponent } from 'app/routes/parks/park-operate/park-operate.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes, { useHash: true }),
        PagesModule
    ],
    declarations: [
        DashboardComponent,
        ParksComponent,
        ParkOperateComponent
    ],
    exports: [
        RouterModule
    ]
})

export class RoutesModule { }
