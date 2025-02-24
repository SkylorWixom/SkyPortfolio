// models/Course.js
import mongoose from 'mongoose';

/**
 * A single module item.
 * Example: { title: "Fields altered by computers" }
 */
const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true }
}, { _id: false });

/**
 * A subLesson that has a title and an array of modules.
 * Example: 
 * {
 *   title: "Intro to Computer Science",
 *   modules: [ { title: "Fields altered by computers" }, ... ]
 * }
 */
const SubLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  modules: [ModuleSchema]
}, { _id: false });

/**
 * A Lesson that has a title and an array of subLessons.
 * Example:
 * {
 *   title: "learn",
 *   subLessons: [
 *     { title: "Intro to Computer Science", modules: [ ... ] },
 *     ...
 *   ]
 * }
 */
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subLessons: [SubLessonSchema]
}, { _id: false });

/**
 * The top-level Course structure:
 *  - title:        "learn"
 *  - subject:      "Computer Science"
 *  - subCategory:  "Intro to Computer Science"
 *  - description:  "Overview..."
 *  - lessons:      [ { title: "learn", ... }, { title: "Do", ... }, ... ]
 */
const CourseSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subject:     { type: String, required: true },
  subCategory: { type: String },
  description: { type: String },
  lessons:     [LessonSchema]
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);
export default Course;
