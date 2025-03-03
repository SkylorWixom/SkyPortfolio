import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { TaskManagerComponent } from './tasks/task-manager/task-manager.component';
import { BlogManagerComponent } from './blogs/blog-manager/blog-manager.component';
import { ProjectManagerComponent } from './projects/project-manager/project-manager.component';
import { LwmManagerComponent } from './lwm/lwm-manager/lwm-manager.component';


@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent,
    TaskManagerComponent,
    BlogManagerComponent,
    ProjectManagerComponent,
    LwmManagerComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
