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
      // If req.body is an array => insertMany
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

//PUT (Update existing project by ID)
router.put('/:id', async (req, res) => {
  try {
    // findByIdAndUpdate returns the *old* doc by default
    // so pass { new: true, runValidators: true }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2) DELETE (Remove a project by ID)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
