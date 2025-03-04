import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskManagerComponent } from './tasks/task-manager/task-manager.component';
import { BlogManagerComponent } from './blogs/blog-manager/blog-manager.component';
import { ProjectManagerComponent } from './projects/project-manager/project-manager.component';
import { LwmManagerComponent } from './lwm/lwm-manager/lwm-manager.component';
import { ContactManagerComponent } from './contact/contact-manager/contact-manager.component';
import { adminGuard } from './admin.guard'; 

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'tasks', component: TaskManagerComponent },
      { path: 'blogs', component: BlogManagerComponent },
      { path: 'projects', component: ProjectManagerComponent },
      { path: 'lwm', component: LwmManagerComponent },
      { path: 'contact', component: ContactManagerComponent },
      { path: '', redirectTo: 'tasks', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
