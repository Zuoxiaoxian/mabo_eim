import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SystemSetComponent } from './system-set.component';

import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { EmployeeComponent } from './employee/employee.component';

import { SecurityLogComponent } from './security-log/security-log.component';
import { UserEmployeeComponent } from './user-employee/user-employee.component';
import { UserEmployeeGroupComponent } from './user-employee-group/user-employee-group.component';

const routes: Routes = [
  {
    path: '',
    component: SystemSetComponent,
    children: [

      {
        path: 'role',
        component: RoleComponent,
      },
      {
        path: 'menu',
        component: MenuComponent,
      },
      {
        path: 'employee',
        component: UserEmployeeComponent,
      },
      {
        path: 'user',
        component: EmployeeComponent,
      },
      {
        path: 'employeegroup',
        component: UserEmployeeGroupComponent,
      },
      {
        path: 'security_log',
        component: SecurityLogComponent,
      },
      {
        path: '',
        redirectTo: 'role',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSetRoutingModule { }
