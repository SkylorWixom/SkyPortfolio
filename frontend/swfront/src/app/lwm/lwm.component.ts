import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Import your new CourseMenuComponent
import { CourseMenuComponent } from './course-menu/course-menu.component';

@Component({
  selector: 'app-lwm',
  standalone: true,
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css'],
  imports: [
    CommonModule,
    CourseMenuComponent
  ]
})
export class LwmComponent implements OnInit {

  selectedType: string | null = null;
  selectedSubject: string | null = null;
  selectedCourse: any = null;
  selectedLesson: any = null;

  constructor() {}

  ngOnInit(): void {
    // no special logic on init, unless you want some
  }

  // Called by <app-course-menu> whenever user clicks subject, course, or lesson
  onMenuItemSelected(eventData: any) {
    this.selectedType = eventData.type || null;

    if (eventData.type === 'subject') {
      this.selectedSubject = eventData.subject;
      this.selectedCourse = null;
      this.selectedLesson = null;
    } else if (eventData.type === 'course') {
      this.selectedCourse = eventData.course;
      this.selectedSubject = eventData.course.subject;
      this.selectedLesson = null;
    } else if (eventData.type === 'lesson') {
      this.selectedCourse = eventData.parentCourse;
      this.selectedLesson = eventData.lesson;
      this.selectedSubject = eventData.parentCourse.subject;
    }
  }
}
