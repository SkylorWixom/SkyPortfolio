// File: backend/models/lwm/Subject.js
import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  subjectTitle: { type: String, required: true },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]
}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
