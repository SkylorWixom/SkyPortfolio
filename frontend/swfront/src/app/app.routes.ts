import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { LwmComponent } from './lwm/lwm.component';

// Temporary placeholders
import { Component } from '@angular/core';

@Component({ template: '<h2>Projects Page - Coming Soon!</h2>' })
export class ProjectsPlaceholderComponent {}

@Component({ template: '<h2>Contact Page - Coming Soon!</h2>' })
export class ContactPlaceholderComponent {}

@Component({ template: '<h2>Resume Page - Coming Soon!</h2>' })
export class ResumePlaceholderComponent {}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'learn-with-me', component: LwmComponent },
  { path: 'projects', component: ProjectsPlaceholderComponent },
  { path: 'contact', component: ContactPlaceholderComponent },
  { path: 'resume', component: ResumePlaceholderComponent }
];
