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
  // (B) Sorting fields
  sortField: string = 'createdAt';   // 'createdAt' | 'title' | 'category'
  sortDirection: string = 'desc';    // 'asc' | 'desc'

  // Existing filter by category
  selectedCategory: string = 'all';

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
    // Or add checks if post.content is undefined
    return this.sanitizer.bypassSecurityTrustHtml(post.content);
  }
  // Provide the method that returns SafeHtml:
  // (C) Single method to filter by category, then apply advanced sorting
  applyFiltersAndSort(): void {
    // 1) Filter by category
    let temp = (this.selectedCategory === 'all')
      ? [...this.posts]
      : this.posts.filter(post => post.category === this.selectedCategory);
    
    // 2) Sort by selected field + direction
    temp.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';
      
      if (this.sortField === 'createdAt') {
        // Convert date to timestamp
        valA = new Date(a.createdAt || '').getTime();
        valB = new Date(b.createdAt || '').getTime();
      } else if (this.sortField === 'title') {
        // Title sorting -> compare strings
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      } else if (this.sortField === 'category') {
        valA = a.category.toLowerCase();
        valB = b.category.toLowerCase();
      }// Inside applyFiltersAndSort():
      else if (this.sortField === 'author') {
        valA = a.author?.toLowerCase() || '';
        valB = b.author?.toLowerCase() || '';
      }      
      if (valA < valB) return (this.sortDirection === 'asc') ? -1 : 1;
      if (valA > valB) return (this.sortDirection === 'asc') ? 1 : -1;
      return 0;
    });

    this.filteredPosts = temp;
  }

  // (D) Handlers for UI events
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

  // (E) Master-detail: user clicks a post in the left column -> display detail on right
  selectPost(post: Blog) {
    this.selectedPost = post;
  }
}
