import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersComponent } from './users/users.component';
import { AdminsRoutes } from './admins.routing';
import { OperateComponent } from './users/operate/operate.component';
import { SharedModule } from '@shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '@core/net/token/token.interceptor';
import { JwtInterceptor } from '@auth0/angular-jwt';
import { RolesComponent } from 'app/routes/admins/roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { TreeModule } from 'angular-tree-component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AdminsRoutes,
    TreeModule
  ],
  declarations: [
    UsersComponent,
    OperateComponent,
    RolesComponent,
    PermissionsComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
})
export class AdminsModule { }
