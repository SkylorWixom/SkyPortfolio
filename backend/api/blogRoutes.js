import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// GET all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST single or multiple
router.post('/', async (req, res) => {
  try {
    // Check if req.body is an array
    if (Array.isArray(req.body)) {
      // If array, insert many
      const insertedBlogs = await Blog.insertMany(req.body);
      return res.status(201).json(insertedBlogs);
    } else {
      // Otherwise, treat it as a single document
      const newBlog = new Blog(req.body);
      const savedBlog = await newBlog.save();
      return res.status(201).json(savedBlog);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// (Optional) GET single by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// (Optional) PUT update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// (Optional) DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
