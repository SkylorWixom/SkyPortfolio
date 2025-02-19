import express from 'express';
import Lwm from '../models/Lwm.js';

const router = express.Router();

// GET all doc(s) in lwms
router.get('/', async (req, res) => {
  try {
    const all = await Lwm.find();  // could be multiple docs, or just 1
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new doc
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
