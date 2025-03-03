/* File: backend/server.js */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1) Load env vars (MONGO_URI, etc.)
dotenv.config();

// 2) Because we’re using ES modules, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3) Create the app
const app = express();
app.use(express.json());
app.use(cors());

// 4) Connect to Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 5) Import your routes
import blogRoutes from './api/blogRoutes.js';
import contactRoutes from './api/contactRoutes.js';
import projectRoutes from './api/projectRoutes.js';
import subjectRoutes from './api/subjectRoutes.js';
import taskRoutes from './api/taskRoutes.js';

// 6) Register routes under /api
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

// 7) Serve Angular's dist folder
//    - We are in "backend/" => go up one folder => "src/" => into "frontend/swfront/dist/swfront"
app.use(express.static(path.join(__dirname, '../frontend/swfront/dist/swfront')));

// 8) Catch-all route for Angular client-side routing
//    - Must match the same folder as above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/swfront/dist/swfront', 'index.html'));
});

// 9) Port from Render or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
