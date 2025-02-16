import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { LwmComponent } from './lwm/lwm.component';
import { ProjectsComponent } from './projects/projects.component';
import { ContactComponent } from './contact/contact.component';

// Temporary placeholders
import { Component } from '@angular/core';


@Component({ template: '<h2>Resume Page - Coming Soon!</h2>' })
export class ResumePlaceholderComponent {}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'learn-with-me', component: LwmComponent },
  { path: 'projects', component: ProjectsComponent },  
  { path: 'contact', component: ContactComponent },
  { path: 'resume', component: ResumePlaceholderComponent }
];
