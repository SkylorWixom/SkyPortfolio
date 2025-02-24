import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService, Course, Lesson, SubLesson, ModuleItem } from '../../services/course/course.service';

/**
 * Extended interfaces so each item can have `_expanded` toggles,
 * and we can show final modules in the same column.
 */
interface ModuleEx extends ModuleItem {
  // e.g. { title: "Fields altered by computers" }
}
interface SubLessonEx extends SubLesson {
  _expanded?: boolean;
  modulesEx: ModuleEx[];
}
interface LessonEx extends Lesson {
  _expanded?: boolean;
  subLessonsEx: SubLessonEx[];
}
interface CourseEx extends Course {
  _expanded?: boolean;
  lessonsEx: LessonEx[];
}
interface SubCatEx {
  subCategory: string;
  expanded: boolean;
  courses: CourseEx[];
}
interface SubjectGroup {
  subject: string;
  expanded: boolean;
  subCats: SubCatEx[];
}

/**
 * We'll store final "selectedModule" in the same column.
 * If it's null, we display "Select a final item" message.
 */
@Component({
  selector: 'app-course-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-menu.component.html',
  styleUrls: ['./course-menu.component.css']
})
export class CourseMenuComponent implements OnInit {
  errorMessage: string | null = null;

  // All expansions in one column: subject -> subCat -> course -> lesson -> sublesson -> module
  subjectGroups: SubjectGroup[] = [];

  // The final module that was clicked. We'll show its details instead of "Select a Subject"
  selectedModule: ModuleItem | null = null;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAll().subscribe({
      next: (all) => this.buildSubjectGroups(all),
      error: (err) => {
        console.error('Error loading courses:', err);
        this.errorMessage = 'Could not load course data.';
      }
    });
  }

  /**
   * Builds up subject -> subCat -> courses, each with expansions for lessons -> subLessons -> modules
   */
  buildSubjectGroups(courses: Course[]): void {
    const subjMap = new Map<string, SubjectGroup>();

    for (const c of courses) {
      const subj = c.subject || '(Unknown Subject)';
      let sg = subjMap.get(subj);
      if (!sg) {
        sg = { subject: subj, expanded: false, subCats: [] };
        subjMap.set(subj, sg);
      }

      const sc = c.subCategory || '(No SubCategory)';
      let scObj = sg.subCats.find(x => x.subCategory === sc);
      if (!scObj) {
        scObj = { subCategory: sc, expanded: false, courses: [] };
        sg.subCats.push(scObj);
      }

      // Convert to CourseEx so we have toggles + expansions
      const courseEx: CourseEx = {
        ...c,
        _expanded: false,
        lessonsEx: c.lessons.map(les => ({
          ...les,
          _expanded: false,
          subLessonsEx: les.subLessons.map(sL => ({
            ...sL,
            _expanded: false,
            modulesEx: sL.modules.map(m => ({ ...m }))
          }))
        }))
      };

      scObj.courses.push(courseEx);
    }

    this.subjectGroups = Array.from(subjMap.values());
  }

  /** 
   * Toggles a subject group 
   */
  toggleSubjectGroup(sg: SubjectGroup) {
    sg.expanded = !sg.expanded;
  }

  /** 
   * Toggles a subCategory group 
   */
  toggleSubCategory(sc: SubCatEx, event: MouseEvent) {
    event.stopPropagation();
    sc.expanded = !sc.expanded;
  }

  /** 
   * Toggles an individual course 
   */
  toggleCourse(c: CourseEx, event: MouseEvent) {
    event.stopPropagation();
    c._expanded = !c._expanded;
  }

  /** 
   * Toggles a lesson 
   */
  toggleLesson(les: LessonEx, event: MouseEvent) {
    event.stopPropagation();
    les._expanded = !les._expanded;
  }

  /** 
   * Toggles a subLesson 
   */
  toggleSubLesson(sub: SubLessonEx, event: MouseEvent) {
    event.stopPropagation();
    sub._expanded = !sub._expanded;
  }

  /**
   * Called when final module item is clicked.
   * We set selectedModule so it replaces "Select a Subject" text.
   */
  onModuleClick(mod: ModuleEx, event: MouseEvent) {
    event.stopPropagation();
    this.selectedModule = mod;
  }
}
