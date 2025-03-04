import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section'
    }
  ]
}, { timestamps: true });

export default mongoose.model('Course', CourseSchema);
