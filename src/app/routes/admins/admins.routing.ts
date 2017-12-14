import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from 'app/routes/admins/users/users.component';
import { OperateComponent } from 'app/routes/admins/users/operate/operate.component';
import { RolesComponent } from 'app/routes/admins/roles/roles.component';
import { PermissionsComponent } from 'app/routes/admins/permissions/permissions.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'permissions', component: PermissionsComponent},
  { path: 'users/operate', component: OperateComponent },
];

export const AdminsRoutes = RouterModule.forChild(routes);
