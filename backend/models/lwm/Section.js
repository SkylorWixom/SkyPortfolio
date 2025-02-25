// File: backend/models/lwm/Section.js
import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  sectionTitle: { type: String, required: true },
  modules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module'
    }
  ]
}, { timestamps: true });

export default mongoose.model('Section', SectionSchema);
