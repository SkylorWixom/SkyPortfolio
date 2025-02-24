import express from 'express';
import Subject from '../models/Subject.js';

const router = express.Router();

// GET all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new subject doc
router.post('/', async (req, res) => {
  try {
    const newSubj = new Subject(req.body);
    const saved = await newSubj.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a subject doc
router.put('/:id', async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a subject doc
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Subject.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
