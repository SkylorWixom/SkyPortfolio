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
    githubLink: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false,
        default: 'web'
    },
    date: {
        type: String,
        required: false
    },
    featured: {
        type: Boolean,
        default: false
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