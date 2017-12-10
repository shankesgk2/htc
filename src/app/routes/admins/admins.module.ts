import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsersComponent } from './users/users.component';
import { AdminsRoutes } from './admins.routing';
import { OperateComponent } from './users/operate/operate.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    AdminsRoutes
  ],
  declarations: [
    UsersComponent,
    OperateComponent
  ]
})
export class AdminsModule { }
