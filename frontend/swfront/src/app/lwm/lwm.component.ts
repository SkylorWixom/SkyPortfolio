import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService, SubjectData, CourseLevel, SectionLevel, FinalItem } from '../services/subject/subject.service';
import { SafeUrlPipe } from '../safe-url.pipe';

/**
 * Extend your section interface for collapsible behavior + tab selection
 */
interface ExtendedSection extends SectionLevel {
  expanded?: boolean;
  activeTab?: string;
}

/**
 * Extend SubjectData for local usage to include iconUrl, bannerUrl if present,
 * plus "expanded" to track the open/closed state in the sidebar.
 */
interface SubjectEx extends SubjectData {
  expanded?: boolean;
  iconUrl?: string;   // optional field from your backend or local mapping
  bannerUrl?: string; // optional field from your backend or local mapping
}

@Component({
  selector: 'app-lwm-alt',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './lwm.component.html',
  styleUrls: ['./lwm.component.css']
})
export class LwmAltComponent implements OnInit {

  // 1) The array of subjects (with optional icon/banner fields)
  subjects: SubjectEx[] = [];

  // 2) The currently selected course to display on the right
  selectedCourse: CourseLevel | null = null;

  // 3) The "extended" sections array for controlling expanded state + active tab
  sectionsEx: ExtendedSection[] = [];

  // 4) The final item user clicked, shown in a modal
  selectedFinalItem: FinalItem | null = null;

  // 5) Modal open/close tracking
  isModalOpen = false;

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.loadSubjects();
  }

  /**
   * Load all subjects from your backend via SubjectService.
   * Mark each subject with "expanded = false" for the sidebar.
   */
  loadSubjects() {
    this.subjectService.getAll().subscribe({
      next: (res) => {
        // If iconUrl or bannerUrl exist in the DB, they'll map over automatically.
        // If not, they're just undefined, which won't break anything.
        this.subjects = res.map((s) => ({
          ...s,
          expanded: false
        }));
      },
      error: (err) => console.error('Error loading subjects:', err)
    });
  }

  /**
   * Expand/collapse a subject in the left sidebar
   */
  toggleSubject(subj: SubjectEx) {
    subj.expanded = !subj.expanded;
  }

  /**
   * When a course is selected, close the modal + build out ExtendedSection[] for the right side
   */
  selectCourse(course: CourseLevel) {
    this.selectedCourse = course;
    this.selectedFinalItem = null;
    this.isModalOpen = false;

    // Mark each section as collapsed + set default activeTab to 'Learn'
    this.sectionsEx = course.sections.map((sec) => ({
      ...sec,
      expanded: false,
      activeTab: 'Learn'
    }));
  }

  /**
   * Expand/collapse a single section
   */
  toggleSection(sec: ExtendedSection) {
    sec.expanded = !sec.expanded;
  }

  /**
   * Set the active tab for a section's modules
   */
  setActiveTab(sec: ExtendedSection, tab: string) {
    sec.activeTab = tab;
  }

  /**
   * Open the modal when user clicks on a final item
   */
  onFinalItemClick(item: FinalItem) {
    this.selectedFinalItem = item;
    this.isModalOpen = true;
  }

  /**
   * Close the modal
   */
  closeModal() {
    this.isModalOpen = false;
  }
}
