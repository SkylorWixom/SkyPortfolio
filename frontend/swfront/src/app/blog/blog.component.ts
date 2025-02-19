import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from '../services/blog/blog.service.js';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  selectedCategory: string = 'all';

  // We'll load real blog data here once the service call completes
  posts: Blog[] = [];
  filteredPosts: Blog[] = [];

  // Inject the service so we can call getAllBlogs()
  constructor(private blogService: BlogService) {}

  // Fetch data from the server as soon as this component is initialized
  ngOnInit(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (data: Blog[]) => {
        this.posts = data;
        this.filteredPosts = data;
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
      }
    });
  }

  // Filter the displayed posts by category
  filterCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => post.category === category);
    }
  }
}
