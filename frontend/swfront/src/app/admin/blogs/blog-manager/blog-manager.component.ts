import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService, Blog } from '../../../services/blog/blog.service';

@Component({
  selector: 'app-blog-manager',
  templateUrl: './blog-manager.component.html',
  styleUrls: ['./blog-manager.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BlogManagerComponent implements OnInit {
  blogs: Blog[] = [];
  newBlog: Blog = this.getEmptyBlog();
  editMode = false;
  successMessage = '';
  errorMessage = '';
  showPreview = false;
  selectedTags: string[] = [];

  // Example set of tags you might want to let users pick from:
  availableTags: string[] = [
    'Angular',
    'React',
    'Vue',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Express',
    'Frontend',
    'Backend',
    'Full Stack'
  ];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  // Fetch all blogs from server
  loadBlogs(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (blogs) => {
        this.blogs = blogs;
      },
      error: (error) => {
        this.errorMessage = `Failed to load blogs: ${error.message}`;
      }
    });
  }

  // Create or update a blog
  saveBlog(): void {
    // Make sure our new/updated blog includes current tags
    this.newBlog.tags = [...this.selectedTags];

    if (this.editMode && this.newBlog._id) {
      // Update existing blog
      this.blogService.updateBlog(this.newBlog._id, this.newBlog).subscribe({
        next: () => {
          this.successMessage = 'Blog post updated successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadBlogs();
        },
        error: (error) => {
          this.errorMessage = `Failed to update blog post: ${error.message}`;
          this.successMessage = '';
        }
      });
    } else {
      // Create new blog
      this.blogService.createBlog(this.newBlog).subscribe({
        next: () => {
          this.successMessage = 'Blog post created successfully!';
          this.errorMessage = '';
          this.resetForm();
          this.loadBlogs();
        },
        error: (error) => {
          this.errorMessage = `Failed to create blog post: ${error.message}`;
          this.successMessage = '';
        }
      });
    }
  }

  // Prepare form to edit an existing blog
  editBlog(blog: Blog): void {
    this.newBlog = { ...blog };
    this.selectedTags = blog.tags || [];
    this.editMode = true;
    this.showPreview = false;
  }

  // Delete a blog
  deleteBlog(id: string): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(id).subscribe({
        next: () => {
          this.successMessage = 'Blog post deleted successfully!';
          this.errorMessage = '';
          this.loadBlogs();
        },
        error: (error) => {
          this.errorMessage = `Failed to delete blog post: ${error.message}`;
          this.successMessage = '';
        }
      });
    }
  }

  // Cancel editing and reset the form
  cancelEdit(): void {
    this.resetForm();
  }

  // Toggle between "Edit" and "Preview"
  togglePreview(): void {
    this.showPreview = !this.showPreview;
  }

  // Tag management
  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.includes(tag);
  }

  addCustomTag(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();

    if (event.key === 'Enter' && value) {
      if (!this.selectedTags.includes(value)) {
        this.selectedTags.push(value);
      }
      input.value = '';
      event.preventDefault();
    }
  }

  // Resets form fields
  private resetForm(): void {
    this.newBlog = this.getEmptyBlog();
    this.selectedTags = [];
    this.editMode = false;
    this.showPreview = false;
  }

  // Returns a fresh "empty" blog that matches your schema
  private getEmptyBlog(): Blog {
    return {
      title: '',
      author: 'S. W.',
      content: '',
      // Set a default category that is in your enum:
      //   ['learning', 'reviews', 'responses', 'personal']
      category: 'learning',
      tags: [],
      excerpt: ''
    };
  }
}
