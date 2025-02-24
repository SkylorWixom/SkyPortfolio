import mongoose from 'mongoose';

const FinalItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  // NEW FIELDS:
  videoUrl: { type: String },
  description: { type: String }
}, { _id: false });



/**
 * Each Module is "Learn," "Do," or "Resources" 
 * holding an array of final items.
 */
const ModuleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true }, 
  // e.g. "Learn", "Do", "Resources"

  finalItems: [ FinalItemSchema ]
}, { _id: false });

/**
 * Each Section is e.g. "Brief history of computer science" 
 * with multiple modules. 
 */
const SectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  modules: [ ModuleSchema ]
}, { _id: false });

/**
 * Each Course is e.g. "Intro to Computer Science," "Security & Ethics," etc.,
 * with multiple sections.
 */
const CourseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  sections: [ SectionSchema ]
}, { _id: false });

/**
 * Finally, the top-level Subject doc
 * e.g. subjectTitle: "Computer Science",
 * with multiple courses.
 */
const SubjectSchema = new mongoose.Schema({
  subjectTitle: { type: String, required: true },
  courses: [ CourseSchema ]
}, { timestamps: true });

const Subject = mongoose.model('Subject', SubjectSchema);
export default Subject;
