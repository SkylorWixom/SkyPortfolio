// File: backend/models/lwm/Module.js
import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  moduleTitle: { type: String, required: true },
  finalItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FinalItem'
    }
  ]
}, { timestamps: true });

export default mongoose.model('Module', ModuleSchema);
