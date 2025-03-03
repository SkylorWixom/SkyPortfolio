import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService, Blog } from '../services/blog/blog.service.js';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  // Sorting fields
  sortField: string = 'createdAt';
  sortDirection: string = 'desc';

  // Filter by category
  selectedCategory: string = 'all';

  // New property for navigation on mobile
  isNavOpen = true;

  posts: Blog[] = [];
  filteredPosts: Blog[] = [];
  
  // For the master-detail layout
  selectedPost: Blog | null = null;

  constructor(private blogService: BlogService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data: Blog[]) => {
        this.posts = data;
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    });
  }
  
  getSafeContent(post: Blog): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(post.content);
  }

  applyFiltersAndSort(): void {
    // Filter by category
    let temp = (this.selectedCategory === 'all')
      ? [...this.posts]
      : this.posts.filter(post => post.category === this.selectedCategory);
    
    // Sort by selected field + direction
    temp.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';
      
      if (this.sortField === 'createdAt') {
        valA = new Date(a.createdAt || '').getTime();
        valB = new Date(b.createdAt || '').getTime();
      } else if (this.sortField === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (this.sortField === 'category') {
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
      } else if (this.sortField === 'author') {
        valA = a.author?.toLowerCase() || '';
        valB = b.author?.toLowerCase() || '';
      }
      
      if (valA < valB) return (this.sortDirection === 'asc') ? -1 : 1;
      if (valA > valB) return (this.sortDirection === 'asc') ? 1 : -1;
      return 0;
    });

    this.filteredPosts = temp;
  }

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.applyFiltersAndSort();
  }

  changeSortField(field: string) {
    this.sortField = field;
    this.applyFiltersAndSort();
  }

  changeSortDirection(direction: string) {
    this.sortDirection = direction;
    this.applyFiltersAndSort();
  }

  selectPost(post: Blog) {
    this.selectedPost = post;
    
    // Close navigation on mobile when selecting a post
    if (window.innerWidth < 768) {
      this.isNavOpen = false;
    }
  }

  toggleNavigationSidebar() {
    this.isNavOpen = !this.isNavOpen;
  }

  // Safe excerpt method
  getExcerpt(post: Blog): string {
    // First try to use excerpt if it exists
    if (post.excerpt) {
      return post.excerpt;
    }
    
    // If no excerpt, create one from content
    if (post.content) {
      const plainText = post.content.replace(/<[^>]*>/g, '');
      return plainText.length > 100 ? plainText.slice(0, 100) + '...' : plainText;
    }
    
    return 'Click to read more...';
  }
}
