import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Import this for titlecase pipe

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule], // <-- Add this here
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  // Current category
  selectedCategory: string = 'all';

  // Sample blog posts
  posts = [
    { title: 'Learning Angular: My Struggles & Solutions', summary: 'Sharing my experience learning Angular and the hurdles I overcame.', category: 'learning' },
    { title: 'PostgreSQL vs MongoDB: My Thoughts', summary: 'A comparison based on my personal projects and performance tests.', category: 'reviews' },
    { title: 'Article Response: AI in Education', summary: 'My thoughts on a recent article about the role of AI in modern education.', category: 'responses' },
    { title: 'My Trip to Yellowstone', summary: 'Travel tips and highlights from my adventure to Yellowstone National Park.', category: 'personal' },
    { title: 'Mastering Debugging Techniques', summary: 'Lessons learned while working on my thesis about delta debugging.', category: 'learning' }
  ];

  // Filtered posts displayed to the user
  filteredPosts = this.posts;

  // Method to filter posts by category
  filterCategory(category: string) {
    this.selectedCategory = category;

    if (category === 'all') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.posts.filter(post => post.category === category);
    }
  }
}
