import express from 'express';
import Lwm from '../models/Lwm.js';

const router = express.Router();

router.get('/', async (req, res) =>{
    try {
        const lwm = await Lwm.find();
        res.json(lwm);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});


router.post('/', async (req, res) =>{
    const lwm = new Lwm(req.body);
  try {
    const newLwm = await lwm.save();
    res.status(201).json(newLwm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router