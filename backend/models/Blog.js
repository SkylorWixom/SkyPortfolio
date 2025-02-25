import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Anonymous'       // or required: true, if you want to enforce it
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['learning', 'reviews', 'responses', 'personal'],
    required: true
  },
  bannerImageUrl: {
    type: String,
    default: ''                // store a URL for an image or leave blank
  },
  references: {
    type: [String],            // an array of strings (links, videos, etc.)
    default: []
  },
  tags: {
    type: [String],            // an array of tags if you’d like 
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
