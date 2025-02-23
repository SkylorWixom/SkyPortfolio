
import express from 'express';
import Course from '../models/Course.js';

const router = express.Router()
// (A) GET all courses
router.get('/', async (req, res) => {
try {
    const courses = await Course.find(); 
    res.json(courses);
} catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Server error while fetching courses.' });
}
})
// (B) GET a single course by ID
router.get('/:id', async (req, res) => {
try {
    const course = await Course.findById(req.params.id);
    if (!course) {
    return res.status(404).json({ error: 'Course not found.' });
    }
    res.json(course);
} catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ error: 'Server error while fetching course.' });
}
})
// (C) POST: Create a new course
router.post('/', async (req, res) => {
try {
    const { title, subject, description, lessons } = req.body;
    const newCourse = new Course({
    title,
    subject,
    description,
    lessons
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
} catch (err) {
    console.error('Error creating course:', err);
    res.status(400).json({ error: 'Failed to create course.' });
}
})
// (D) PUT: Update an existing course
router.put('/:id', async (req, res) => {
try {
    const { title, subject, description, lessons } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { title, subject, description, lessons },
    { new: true }
    );
    if (!updatedCourse) {
    return res.status(404).json({ error: 'Course not found.' });
    }
    res.json(updatedCourse);
} catch (err) {
    console.error('Error updating course:', err);
    res.status(400).json({ error: 'Failed to update course.' });
}
})
// (E) DELETE an existing course
router.delete('/:id', async (req, res) => {
try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
    return res.status(404).json({ error: 'Course not found.' });
    }
    res.json({ message: 'Course deleted successfully.' });
} catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ error: 'Server error while deleting course.' });
}
})
export default router