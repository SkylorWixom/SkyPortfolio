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
 * POST /nested: if you want to create a subject with nested courses→sections→modules→finalItems
 * in one request, unroll them here.
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

/**
 * Add a new course to a subject
 */
router.post('/:id/courses', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();

    subject.courses.push(savedCourse._id);
    await subject.save();
    
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update a course
 */
router.put('/courses/:id', async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a course
 */
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove the reference from subject
    await Subject.updateMany(
      { courses: req.params.id },
      { $pull: { courses: req.params.id } }
    );

    // Actually delete the course
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Add a new section to a course
 */
router.post('/courses/:id/sections', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newSection = new Section(req.body);
    const savedSection = await newSection.save();

    course.sections.push(savedSection._id);
    await course.save();
    
    res.status(201).json(savedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update a section
 */
router.put('/sections/:id', async (req, res) => {
  try {
    const updated = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a section
 */
router.delete('/sections/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Remove the reference from course
    await Course.updateMany(
      { sections: req.params.id },
      { $pull: { sections: req.params.id } }
    );

    // Actually delete the section
    await Section.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Add a new module to a section
 */
router.post('/sections/:id/modules', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    const newModule = new Module(req.body);
    const savedModule = await newModule.save();

    section.modules.push(savedModule._id);
    await section.save();
    
    res.status(201).json(savedModule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update a module
 */
router.put('/modules/:id', async (req, res) => {
  try {
    const updated = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a module
 */
router.delete('/modules/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Remove the reference from section
    await Section.updateMany(
      { modules: req.params.id },
      { $pull: { modules: req.params.id } }
    );

    // Actually delete the module
    await Module.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Module deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Add a new finalItem to a module
 */
router.post('/modules/:id/finalItems', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const newFinalItem = new FinalItem(req.body);
    const savedFinalItem = await newFinalItem.save();

    module.finalItems.push(savedFinalItem._id);
    await module.save();
    
    res.status(201).json(savedFinalItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update a finalItem
 */
router.put('/finalItems/:id', async (req, res) => {
  try {
    const updated = await FinalItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Final item not found' });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a finalItem
 */
router.delete('/finalItems/:id', async (req, res) => {
  try {
    const finalItem = await FinalItem.findById(req.params.id);
    if (!finalItem) {
      return res.status(404).json({ message: 'Final item not found' });
    }

    // Remove the reference from module
    await Module.updateMany(
      { finalItems: req.params.id },
      { $pull: { finalItems: req.params.id } }
    );

    // Actually delete the finalItem
    await FinalItem.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Final item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
