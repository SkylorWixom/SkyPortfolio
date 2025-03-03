import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, SubjectData, CourseLevel, SectionLevel, ModuleLevel, FinalItem } from '../services/subject/subject.service';
import { SafeUrlPipe } from '../safe-url.pipe';

/**
 * Extended interfaces for the navigation menu
 */
interface ExtendedSection extends SectionLevel {
  expanded?: boolean;
  modules: ExtendedModule[]; // Update this to use ExtendedModule array
}

interface ExtendedCourse extends CourseLevel {
  expanded?: boolean;
  sections: ExtendedSection[];
}

interface ExtendedModule extends ModuleLevel {
  expanded?: boolean;
}

interface SubjectEx extends SubjectData {
  expanded?: boolean;
  courses: ExtendedCourse[];
}

@Component({
  selector: 'app-lwm',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css']
})
export class LwmComponent implements OnInit {
  // The hierarchical navigation data
  subjects: SubjectEx[] = [];
  
  // Selection tracking
  selectedCourse: ExtendedCourse | null = null;
  selectedFinalItem: FinalItem | null = null;
  
  // For modal (if you still want to keep this functionality)
  isModalOpen = false;

  // Add this property to your component class:
  isNavOpen = true; // Change to true so navigation shows by default

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  /**
   * Load subjects and prepare them for the hierarchical navigation
   */
  loadSubjects() {
    this.subjectService.getAll().subscribe({
      next: (res) => {
        // Process the subjects to add expanded flags at each level
        this.subjects = res.map(subj => ({
          ...subj,
          expanded: false,
          courses: subj.courses.map(course => ({
            ...course,
            expanded: false,
            sections: course.sections.map(section => ({
              ...section,
              expanded: false,
              modules: section.modules.map(module => ({
                ...module,
                expanded: false
              }))
            }))
          }))
        }));
      },
      error: (err) => console.error('Error loading subjects:', err)
    });
  }

  /**
   * Toggle subject expansion in the navigation
   */
  toggleSubject(subject: SubjectEx) {
    subject.expanded = !subject.expanded;
  }

  /**
   * Toggle course expansion in the navigation
   */
  toggleCourse(course: ExtendedCourse) {
    course.expanded = !course.expanded;
    this.selectedCourse = course;
  }

  /**
   * Toggle section expansion in the navigation
   */
  toggleSectionNav(section: ExtendedSection) {
    section.expanded = !section.expanded;
  }

  /**
   * Toggle module expansion in the navigation
   */
  toggleModuleNav(module: ExtendedModule) {
    module.expanded = !module.expanded;
  }

  /**
   * Select a final item to display its content in the right column
   */
  selectFinalItem(item: FinalItem) {
    this.selectedFinalItem = item;
    
    // Add this line to close navigation on mobile after selection
    if (window.innerWidth < 768) {
      this.isNavOpen = false;
    }
  }
  
  /**
   * Close the modal if you're still using it
   */
  closeModal() {
    this.isModalOpen = false;
  }

  // Add this method to your component class:
  toggleNavigationSidebar() {
    this.isNavOpen = !this.isNavOpen;
  }
}
