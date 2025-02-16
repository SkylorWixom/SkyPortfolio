import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';  // Import RouterLink

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css'],
  imports: [RouterLink]  // Add RouterLink to imports
})
export class ResumeComponent {}
