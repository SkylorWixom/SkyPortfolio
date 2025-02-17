import express from 'express';
import Contact from '../models/Contact.js'; 

const router = express.Router();

// GET all contact submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new contact submission
router.post('/', async (req, res) => {
  const newContact = new Contact(req.body);
  try {
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
