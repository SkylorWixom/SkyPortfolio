import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProjectManagerComponent } from './projects/project-manager/project-manager.component';
import { BlogManagerComponent } from './blogs/blog-manager/blog-manager.component';
import { LwmManagerComponent } from './lwm/lwm-manager/lwm-manager.component';
import { TaskManagerComponent } from './tasks/task-manager/task-manager.component';
import { ContactManagerComponent } from './contact/contact-manager/contact-manager.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    HttpClientModule,
    ContactManagerComponent, 
    TaskManagerComponent,
    BlogManagerComponent,
    ProjectManagerComponent,
    LwmManagerComponent
  ]
})
export class AdminModule { }