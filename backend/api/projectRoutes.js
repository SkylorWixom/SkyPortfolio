import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST single OR multiple projects
router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      // If req.body is an ARRAY => insertMany
      const insertedProjects = await Project.insertMany(req.body);
      return res.status(201).json(insertedProjects);
    } else {
      // Otherwise, assume a SINGLE project object
      const project = new Project(req.body);
      const newProject = await project.save();
      return res.status(201).json(newProject);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
