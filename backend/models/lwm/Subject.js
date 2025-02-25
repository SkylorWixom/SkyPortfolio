// backend/models/lwm/Subject.js
import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
  subjectTitle: {
    type: String,
    required: true
  },

  // (A) The new optional fields for images/icons
  iconUrl: {
    type: String,
    required: false
  },
  bannerUrl: {
    type: String,
    required: false
  },

  // (B) The array of Course references
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ]

}, { timestamps: true });

export default mongoose.model('Subject', SubjectSchema);
