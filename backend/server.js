// File: backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 1) Load .env variables (like MONGO_URI)
dotenv.config();

// 2) Import your route modules (adjust paths if they differ)
import blogRoutes from './api/blogRoutes.js';
import contactRoutes from './api/contactRoutes.js';
import projectRoutes from './api/projectRoutes.js';
import subjectRoutes from './api/subjectRoutes.js';
import taskRoutes from './api/taskRoutes.js';

// 3) Create the Express app
const app = express();

// 4) Middleware
app.use(express.json());      // parse JSON bodies
app.use(cors());              // allow cross-origin requests
app.use(express.static('public')); // if you have images or static files in /public

// 5) Connect to MongoDB via MONGO_URI in .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 6) Register your routes under /api/...
//    Make sure your blogRoutes etc. actually export an Express router
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

// 7) Simple health-check route at root
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// 8) Start listening on the port from .env or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
