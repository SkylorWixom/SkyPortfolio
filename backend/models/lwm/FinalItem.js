// File: backend/models/lwm/FinalItem.js
import mongoose from 'mongoose';

const FinalItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('FinalItem', FinalItemSchema);
