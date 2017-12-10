import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@shared/shared.module';

import { LoginComponent } from './login/login.component';
import { LockComponent } from './lock/lock.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    LoginComponent,
    LockComponent
  ]
})
export class PagesModule { }
