import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import route modules for each resource/entity
import ProjectRoutes from './api/projectRoutes.js';
import BlogRoutes from './api/blogRoutes.js';
import ContactRoutes from './api/contactRoutes.js';
import LwmRoutes from './api/lwmRoutes.js';
import TaskRoutes from './api/taskRoutes.js';
import CourseRoutes from './api/courseRoutes.js';
import cors from 'cors';

// Read environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());
app.use(cors());
// Register routes under specific paths
app.use('/api/courses', CourseRoutes);
app.use('/api/projects', ProjectRoutes);
app.use('/api/blogs', BlogRoutes);
app.use('/api/contacts', ContactRoutes);
app.use('/api/lwm', LwmRoutes);
app.use('/api/tasks', TaskRoutes);

// Connect to MongoDB using environment variable MONGO_URI
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Simple test route at the root path
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Determine the port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Start the Express server on the chosen port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
