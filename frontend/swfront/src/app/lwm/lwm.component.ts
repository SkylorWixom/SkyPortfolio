import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, SubjectData, CourseLevel, SectionLevel, FinalItem } from '../services/subject/subject.service';
import { SafeUrlPipe } from '../safe-url.pipe';

/**
 * We add "expanded?: boolean; activeTab?: string;" to each section so we can fold/unfold them. 
 * For the subject, we do "expanded?: boolean;" for collapsing the left nav items.
 */
interface ExtendedSection extends SectionLevel {
  expanded?: boolean;
  activeTab?: string;
}
interface SubjectEx extends SubjectData {
  expanded?: boolean;
}

@Component({
  selector: 'app-lwm-alt',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css']
})
export class LwmAltComponent implements OnInit {

  // 1) The top-level array of subjects from your backend
  subjects: SubjectEx[] = [];

  // 2) The currently selected course on the right
  selectedCourse: CourseLevel | null = null;

  // 3) For that course, we store an array of extended sections, each with "expanded" and "activeTab"
  sectionsEx: ExtendedSection[] = [];

  // 4) The final item (like "Fields altered by computers") that the user last clicked
  selectedFinalItem: FinalItem | null = null;

  // 5) A boolean to toggle the modal
  isModalOpen = false;

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  /**
   * Load all subjects from your backend. 
   * We'll mark each subject with "expanded = false."
   */
  loadSubjects() {
    this.subjectService.getAll().subscribe({
      next: (res) => {
        this.subjects = res.map(s => ({
          ...s,
          expanded: false
        }));
      },
      error: (err) => console.error('Error loading subjects:', err)
    });
  }

  /**
   * Toggle a subject’s expanded state in the left nav
   */
  toggleSubject(subj: SubjectEx) {
    subj.expanded = !subj.expanded;
  }

  /**
   * When a course is selected, we reset the final item + close modal,
   * and build our sectionsEx array for the right side
   */
  selectCourse(course: CourseLevel) {
    this.selectedCourse = course;
    this.selectedFinalItem = null;
    this.isModalOpen = false;

    this.sectionsEx = course.sections.map(sec => ({
      ...sec,
      expanded: false,
      activeTab: 'Learn'
    }));
  }

  /**
   * Toggle a single section's expanded/collapsed accordion
   */
  toggleSection(sec: ExtendedSection) {
    sec.expanded = !sec.expanded;
  }

  /**
   * Switch the active tab (e.g. "Learn", "Do", or "Resources")
   */
  setActiveTab(sec: ExtendedSection, tab: string) {
    sec.activeTab = tab;
  }

  /**
   * Called when user clicks a final item. Instead of pushing it to the bottom, 
   * we open a modal with the final item’s details (title, description, videoUrl).
   */
  onFinalItemClick(item: FinalItem) {
    this.selectedFinalItem = item;
    this.isModalOpen = true;
  }

  /**
   * Hide the modal
   */
  closeModal() {
    this.isModalOpen = false;
  }
}
