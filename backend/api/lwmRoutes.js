import express from 'express';
import Lwm from '../models/Lwm.js';

const router = express.Router();

// GET: Return all "Lwm" docs (which we expect to be an array, or maybe just one doc)
router.get('/', async (req, res) => {
  try {
    const data = await Lwm.find(); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Insert a new doc
router.post('/', async (req, res) => {
  try {
    const doc = new Lwm(req.body); 
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
