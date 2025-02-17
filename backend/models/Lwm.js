import mongoose from 'mongoose';

// Define the schema for Learn with Me topics
const lwmSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  subtopics: {
    type: [String],
    required: true
  },
  content: {
    introduction: {
      type: String,
      required: true
    },
    resources: {
      type: [String],
      required: false
    },
    downloads: {
      type: [String],
      required: false
    },
    videos: {
      type: [String],
      required: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lwm = mongoose.model('Lwm', lwmSchema);

export default Lwm;
