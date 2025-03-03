/* File: backend/server.js */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1) Load environment variables from .env (e.g. MONGO_URI)
dotenv.config();

// 2) Because we're using ES modules, we need a way to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3) Create the Express app and apply middleware
const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Allow cross-origin requests

// 4) Connect to MongoDB using the MONGO_URI from .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 5) Import and register your route modules (adjust paths if needed)
import blogRoutes from './api/blogRoutes.js';
import contactRoutes from './api/contactRoutes.js';
import projectRoutes from './api/projectRoutes.js';
import subjectRoutes from './api/subjectRoutes.js';
import taskRoutes from './api/taskRoutes.js';

// Register routes under /api
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

// 6) Serve the Angular build from dist/swfront
app.use(express.static(path.join(__dirname, '../swfront/dist/swfront')));

// 7) Catch-all route to serve index.html for any path not handled by /api
//    This lets Angular do client-side routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/swfront/dist/swfront', 'index.html'));
});

// 8) Start listening on the port from environment or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
