import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from 'app/routes/admins/users/users.component';
import { OperateComponent } from 'app/routes/admins/users/operate/operate.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'users', component: UsersComponent },
  { path: 'operate', component: OperateComponent },
];

export const AdminsRoutes = RouterModule.forChild(routes);
