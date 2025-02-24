import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import your routes
import CourseRoutes from './api/courseRoutes.js'; 
import ProjectRoutes from './api/projectRoutes.js';
import BlogRoutes from './api/blogRoutes.js';
import ContactRoutes from './api/contactRoutes.js';
import TaskRoutes from './api/taskRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Register your routes
app.use('/api/courses', CourseRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/blogs', BlogRoutes);
app.use('/api/contacts', ContactRoutes);
app.use('/api/tasks', TaskRoutes);

// Connect to Mongo
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Health-check route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
