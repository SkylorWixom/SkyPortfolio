// File: backend/subjectRoutes.js
import express from 'express';
import Subject from '../models/lwm/Subject.js';
import Course from '../models/lwm/Course.js';
import Section from '../models/lwm/Section.js';
import Module from '../models/lwm/Module.js';
import FinalItem from '../models/lwm/FinalItem.js';

const router = express.Router();

/**
 * GET all subjects (deep populate).
 * This ensures each Subject doc in the array has:
 *  subjectTitle,
 *  courses: [ { courseTitle, sections: [ { sectionTitle, modules: [ { moduleTitle, finalItems: [...] } ] } ] } ]
 */
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: 'courses',
        populate: {
          path: 'sections',
          populate: {
            path: 'modules',
            populate: { path: 'finalItems' }
          }
        }
      });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET one subject by ID, also deep populate.
 */
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate({
        path: 'courses',
        populate: {
          path: 'sections',
          populate: {
            path: 'modules',
            populate: { path: 'finalItems' }
          }
        }
      });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST: create a new Subject doc in basic form.
 * e.g. { "subjectTitle": "Something", "courses": ["ObjectIdOfCourse", ...] }
 */
router.post('/', async (req, res) => {
  try {
    const newSubj = new Subject(req.body);
    const saved = await newSubj.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * POST /nested:
 * If you want to create a subject with nested courses→sections→modules→finalItems 
 * in one request, we unroll them here and store references at each level.
 */
router.post('/nested', async (req, res) => {
  try {
    const { subjectTitle, courses } = req.body;
    const courseIds = [];

    for (const courseObj of courses) {
      const { courseTitle, sections } = courseObj;
      const sectionIds = [];

      for (const sectionObj of sections) {
        const { sectionTitle, modules } = sectionObj;
        const moduleIds = [];

        for (const moduleObj of modules) {
          const { moduleTitle, finalItems } = moduleObj;
          const finalItemIds = [];

          for (const fi of finalItems) {
            const createdFinalItem = await FinalItem.create(fi);
            finalItemIds.push(createdFinalItem._id);
          }

          const createdModule = await Module.create({
            moduleTitle,
            finalItems: finalItemIds
          });
          moduleIds.push(createdModule._id);
        }

        const createdSection = await Section.create({
          sectionTitle,
          modules: moduleIds
        });
        sectionIds.push(createdSection._id);
      }

      const createdCourse = await Course.create({
        courseTitle,
        sections: sectionIds
      });
      courseIds.push(createdCourse._id);
    }

    const createdSubject = await Subject.create({
      subjectTitle,
      courses: courseIds
    });

    const fullPopulated = await Subject.findById(createdSubject._id)
      .populate({
        path: 'courses',
        populate: {
          path: 'sections',
          populate: {
            path: 'modules',
            populate: { path: 'finalItems' }
          }
        }
      });

    res.status(201).json(fullPopulated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * PUT update a subject doc
 */
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

/**
 * DELETE a subject doc
 */
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
