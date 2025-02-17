import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,         
        required: true,       
        trim: true            
      },
      description: {
        type: String,         
        required: true        
      },
      stack: {
        type: [String],       
        required: true        
      },
      demoLink: {
        type: String,         
        required: false      
      },
      thumbnail: {
        type: String,         
        required: false       
      },
      createdAt: {
        type: Date,           
        default: Date.now     
      }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;