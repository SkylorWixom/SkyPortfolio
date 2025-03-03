// File: backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// Connect to Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Import your routes
import blogRoutes from './api/blogRoutes.js';
import contactRoutes from './api/contactRoutes.js';
import projectRoutes from './api/projectRoutes.js';
import subjectRoutes from './api/subjectRoutes.js';
import taskRoutes from './api/taskRoutes.js';

// Register them
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tasks', taskRoutes);

// Serve the Angular build
// (One level up from backend -> SkyPortfolio -> down into frontend/swfront/dist/swfront)
app.use(express.static(path.join(__dirname, '../frontend/swfront/dist/swfront/browser')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/swfront/dist/swfront', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
