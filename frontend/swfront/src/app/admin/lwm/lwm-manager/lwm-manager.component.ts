import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService, SubjectData, CourseLevel, SectionLevel, ModuleLevel, FinalItem } from '../../../services/subject/subject.service';

interface HierarchyItem {
  id?: string;
  expanded?: boolean;
  title: string;
  type: 'subject' | 'course' | 'section' | 'module' | 'finalItem';
  parent?: HierarchyItem;
  children?: HierarchyItem[];
  data?: any;
}

@Component({
  selector: 'app-lwm-manager',
  templateUrl: './lwm-manager.component.html',
  styleUrls: ['./lwm-manager.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LwmManagerComponent implements OnInit {
  subjects: SubjectData[] = [];
  hierarchyItems: HierarchyItem[] = [];
  selectedItem: HierarchyItem | null = null;
  currentContent: any = null;
  
  // Form fields for different levels
  newSubject = { subjectTitle: '', iconUrl: '', bannerUrl: '' };
  newCourse = { courseTitle: '' };
  newSection = { sectionTitle: '' };
  newModule = { moduleTitle: '' };
  newFinalItem = { title: '', content: '', videoUrl: '', description: '' };
  
  // UI states
  successMessage = '';
  errorMessage = '';
  editMode = false;
  showForm = false;
  formType: 'subject' | 'course' | 'section' | 'module' | 'finalItem' | null = null;
  
  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAll().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.buildHierarchy();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to load subjects: ${error.message || 'Unknown error'}`;
      }
    });
  }

  buildHierarchy(): void {
    // Build the "tree" of HierarchyItem objects
    this.hierarchyItems = this.subjects.map(subject => ({
      id: subject._id,
      title: subject.subjectTitle,
      type: 'subject',
      expanded: false,
      data: subject,
      children: subject.courses.map(course => ({
        id: course._id,
        title: course.courseTitle,
        type: 'course',
        expanded: false,
        data: course,
        children: course.sections.map(section => ({
          id: section._id,
          title: section.sectionTitle,
          type: 'section',
          expanded: false,
          data: section,
          children: section.modules.map(module => ({
            id: module._id,
            title: module.moduleTitle,
            type: 'module',
            expanded: false,
            data: module,
            children: module.finalItems.map(finalItem => ({
              id: finalItem._id,
              title: finalItem.title,
              type: 'finalItem',
              data: finalItem
            }))
          }))
        }))
      }))
    }));
  }

  toggleExpanded(item: HierarchyItem): void {
    item.expanded = !item.expanded;
  }

  selectItem(item: HierarchyItem): void {
    this.selectedItem = item;
    this.currentContent = item.data;
    this.showForm = false;
    this.clearMessages();
  }

  showAddForm(type: 'subject' | 'course' | 'section' | 'module' | 'finalItem', parent?: HierarchyItem): void {
    this.formType = type;
    this.editMode = false;
    this.showForm = true;
    this.selectedItem = parent || null;
    this.clearForm();
    this.clearMessages();
  }

  showEditForm(): void {
    if (!this.selectedItem) return;
    
    this.formType = this.selectedItem.type;
    this.editMode = true;
    this.showForm = true;
    
    // Populate the form based on the item type
    switch (this.selectedItem.type) {
      case 'subject':
        const subject = this.selectedItem.data;
        this.newSubject = {
          subjectTitle: subject.subjectTitle,
          iconUrl: subject.iconUrl || '',
          bannerUrl: subject.bannerUrl || ''
        };
        break;
      case 'course':
        this.newCourse = {
          courseTitle: this.selectedItem.data.courseTitle
        };
        break;
      case 'section':
        this.newSection = {
          sectionTitle: this.selectedItem.data.sectionTitle
        };
        break;
      case 'module':
        this.newModule = {
          moduleTitle: this.selectedItem.data.moduleTitle
        };
        break;
      case 'finalItem':
        const finalItem = this.selectedItem.data;
        this.newFinalItem = {
          title: finalItem.title,
          content: finalItem.content || '',
          videoUrl: finalItem.videoUrl || '',
          description: finalItem.description || ''
        };
        break;
    }
  }

  saveItem(): void {
    if (!this.formType) return;
    
    if (this.editMode) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

  createItem(): void {
    switch (this.formType) {
      case 'subject':
        this.createSubject();
        break;
      case 'course':
        this.createCourse();
        break;
      case 'section':
        this.createSection();
        break;
      case 'module':
        this.createModule();
        break;
      case 'finalItem':
        this.createFinalItem();
        break;
    }
  }

  updateItem(): void {
    if (!this.selectedItem || !this.formType) return;
    
    switch (this.formType) {
      case 'subject':
        this.updateSubject();
        break;
      case 'course':
        this.updateCourse();
        break;
      case 'section':
        this.updateSection();
        break;
      case 'module':
        this.updateModule();
        break;
      case 'finalItem':
        this.updateFinalItem();
        break;
    }
  }

  // -- CREATE
  createSubject(): void {
    const subjectData = {
      subjectTitle: this.newSubject.subjectTitle,
      iconUrl: this.newSubject.iconUrl,
      bannerUrl: this.newSubject.bannerUrl,
      courses: []
    };
    this.subjectService.create(subjectData).subscribe({
      next: () => {
        this.successMessage = 'Subject created successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create subject: ${error.message || 'Unknown error'}`;
      }
    });
  }

  createCourse(): void {
    if (!this.selectedItem) return;
    
    const subjectId = this.findSubjectId(this.selectedItem);
    if (!subjectId) {
      this.errorMessage = 'Could not determine parent subject';
      return;
    }
    
    const courseData = {
      courseTitle: this.newCourse.courseTitle,
      sections: []
    };
    
    this.subjectService.createCourse(subjectId, courseData).subscribe({
      next: () => {
        this.successMessage = 'Course created successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create course: ${error.message || 'Unknown error'}`;
      }
    });
  }

  createSection(): void {
    if (!this.selectedItem) return;
    
    const courseId = this.findCourseId(this.selectedItem);
    if (!courseId) {
      this.errorMessage = 'Could not determine parent course';
      return;
    }
    
    const sectionData = {
      sectionTitle: this.newSection.sectionTitle,
      modules: []
    };
    
    this.subjectService.createSection(courseId, sectionData).subscribe({
      next: () => {
        this.successMessage = 'Section created successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create section: ${error.message || 'Unknown error'}`;
      }
    });
  }

  createModule(): void {
    if (!this.selectedItem) return;
    
    const sectionId = this.findSectionId(this.selectedItem);
    if (!sectionId) {
      this.errorMessage = 'Could not determine parent section';
      return;
    }
    
    const moduleData = {
      moduleTitle: this.newModule.moduleTitle,
      finalItems: []
    };
    
    this.subjectService.createModule(sectionId, moduleData).subscribe({
      next: () => {
        this.successMessage = 'Module created successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create module: ${error.message || 'Unknown error'}`;
      }
    });
  }

  createFinalItem(): void {
    if (!this.selectedItem) return;
    
    const moduleId = this.findModuleId(this.selectedItem);
    if (!moduleId) {
      this.errorMessage = 'Could not determine parent module';
      return;
    }
    
    const finalItemData = {
      title: this.newFinalItem.title,
      content: this.newFinalItem.content,
      videoUrl: this.newFinalItem.videoUrl,
      description: this.newFinalItem.description
    };
    
    this.subjectService.createFinalItem(moduleId, finalItemData).subscribe({
      next: () => {
        this.successMessage = 'Final item created successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to create final item: ${error.message || 'Unknown error'}`;
      }
    });
  }

  // -- UPDATE
  updateSubject(): void {
    if (!this.selectedItem?.id) return;
    
    const subjectData = {
      subjectTitle: this.newSubject.subjectTitle,
      iconUrl: this.newSubject.iconUrl,
      bannerUrl: this.newSubject.bannerUrl
    };
    
    this.subjectService.update(this.selectedItem.id, subjectData).subscribe({
      next: () => {
        this.successMessage = 'Subject updated successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update subject: ${error.message || 'Unknown error'}`;
      }
    });
  }

  updateCourse(): void {
    if (!this.selectedItem?.id) return;
    
    const courseData = {
      courseTitle: this.newCourse.courseTitle
    };
    
    this.subjectService.updateCourse(this.selectedItem.id, courseData).subscribe({
      next: () => {
        this.successMessage = 'Course updated successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update course: ${error.message || 'Unknown error'}`;
      }
    });
  }

  updateSection(): void {
    if (!this.selectedItem?.id) return;
    
    const sectionData = {
      sectionTitle: this.newSection.sectionTitle
    };
    
    this.subjectService.updateSection(this.selectedItem.id, sectionData).subscribe({
      next: () => {
        this.successMessage = 'Section updated successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update section: ${error.message || 'Unknown error'}`;
      }
    });
  }

  updateModule(): void {
    if (!this.selectedItem?.id) return;
    
    const moduleData = {
      moduleTitle: this.newModule.moduleTitle
    };
    
    this.subjectService.updateModule(this.selectedItem.id, moduleData).subscribe({
      next: () => {
        this.successMessage = 'Module updated successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update module: ${error.message || 'Unknown error'}`;
      }
    });
  }

  updateFinalItem(): void {
    if (!this.selectedItem?.id) return;
    
    const finalItemData = {
      title: this.newFinalItem.title,
      content: this.newFinalItem.content,
      videoUrl: this.newFinalItem.videoUrl,
      description: this.newFinalItem.description
    };
    
    this.subjectService.updateFinalItem(this.selectedItem.id, finalItemData).subscribe({
      next: () => {
        this.successMessage = 'Final item updated successfully!';
        this.loadSubjects();
        this.hideForm();
      },
      error: (error: any) => {
        this.errorMessage = `Failed to update final item: ${error.message || 'Unknown error'}`;
      }
    });
  }

  // -- DELETE
  deleteItem(): void {
    if (!this.selectedItem?.id) return;
    
    if (!confirm(`Are you sure you want to delete this ${this.selectedItem.type}?`)) {
      return;
    }
    
    switch (this.selectedItem.type) {
      case 'subject':
        this.deleteSubject();
        break;
      case 'course':
        this.deleteCourse();
        break;
      case 'section':
        this.deleteSection();
        break;
      case 'module':
        this.deleteModule();
        break;
      case 'finalItem':
        this.deleteFinalItem();
        break;
    }
  }

  deleteSubject(): void {
    if (!this.selectedItem?.id) return;
    
    this.subjectService.delete(this.selectedItem.id).subscribe({
      next: () => {
        this.successMessage = 'Subject deleted successfully!';
        this.loadSubjects();
        this.selectedItem = null;
        this.currentContent = null;
        this.showForm = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete subject: ${error.message || 'Unknown error'}`;
      }
    });
  }

  deleteCourse(): void {
    if (!this.selectedItem?.id) return;
    
    this.subjectService.deleteCourse(this.selectedItem.id).subscribe({
      next: () => {
        this.successMessage = 'Course deleted successfully!';
        this.loadSubjects();
        this.selectedItem = null;
        this.currentContent = null;
        this.showForm = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete course: ${error.message || 'Unknown error'}`;
      }
    });
  }

  deleteSection(): void {
    if (!this.selectedItem?.id) return;
    
    this.subjectService.deleteSection(this.selectedItem.id).subscribe({
      next: () => {
        this.successMessage = 'Section deleted successfully!';
        this.loadSubjects();
        this.selectedItem = null;
        this.currentContent = null;
        this.showForm = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete section: ${error.message || 'Unknown error'}`;
      }
    });
  }

  deleteModule(): void {
    if (!this.selectedItem?.id) return;
    
    this.subjectService.deleteModule(this.selectedItem.id).subscribe({
      next: () => {
        this.successMessage = 'Module deleted successfully!';
        this.loadSubjects();
        this.selectedItem = null;
        this.currentContent = null;
        this.showForm = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete module: ${error.message || 'Unknown error'}`;
      }
    });
  }

  deleteFinalItem(): void {
    if (!this.selectedItem?.id) return;
    
    this.subjectService.deleteFinalItem(this.selectedItem.id).subscribe({
      next: () => {
        this.successMessage = 'Final item deleted successfully!';
        this.loadSubjects();
        this.selectedItem = null;
        this.currentContent = null;
        this.showForm = false;
      },
      error: (error: any) => {
        this.errorMessage = `Failed to delete final item: ${error.message || 'Unknown error'}`;
      }
    });
  }

  // -- UTILS
  hideForm(): void {
    this.showForm = false;
    this.clearForm();
  }

  clearForm(): void {
    this.newSubject = { subjectTitle: '', iconUrl: '', bannerUrl: '' };
    this.newCourse = { courseTitle: '' };
    this.newSection = { sectionTitle: '' };
    this.newModule = { moduleTitle: '' };
    this.newFinalItem = { title: '', content: '', videoUrl: '', description: '' };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  findSubjectId(item: HierarchyItem): string | null {
    if (item.type === 'subject') return item.id || null;
    return null;
  }

  findCourseId(item: HierarchyItem): string | null {
    if (item.type === 'course') return item.id || null;
    if (item.type === 'subject') return null;
    
    // For nested items, navigate up the chain:
    if (['section', 'module', 'finalItem'].includes(item.type) && item.parent) {
      if (item.parent.type === 'course') return item.parent.id || null;
      return this.findCourseId(item.parent);
    }
    return null;
  }

  findSectionId(item: HierarchyItem): string | null {
    if (item.type === 'section') return item.id || null;
    return null;
  }

  findModuleId(item: HierarchyItem): string | null {
    if (item.type === 'module') return item.id || null;
    return null;
  }

  getItemLabel(type: string): string {
    switch (type) {
      case 'subject': return 'Subject';
      case 'course': return 'Course';
      case 'section': return 'Section';
      case 'module': return 'Module';
      case 'finalItem': return 'Content Item';
      default: return type;
    }
  }

  getItemIconClass(type: string): string {
    // Not currently used in your template, but you could do it if you prefer dynamic icons
    switch (type) {
      case 'subject': return 'fas fa-book';
      case 'course': return 'fas fa-graduation-cap';
      case 'section': return 'fas fa-layer-group';
      case 'module': return 'fas fa-cube';
      case 'finalItem': return 'fas fa-file-alt';
      default: return 'fas fa-question';
    }
  }
}
