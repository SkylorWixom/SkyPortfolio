import mongoose from 'mongoose';

// (A) Define a 'lessonSchema' if you want sub-documents for lessons (optional)
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  }
}, { _id: false });

// (B) Define the main schema for 'Course'
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  lessons: [lessonSchema] // (C) An array of sub-documents for lessons
}, {
  timestamps: true
});

// (D) Create and export the 'Course' model
const Course = mongoose.model('Course', courseSchema);
export default Course;
