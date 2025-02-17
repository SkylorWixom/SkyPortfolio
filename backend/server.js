import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProjectRoutes from './projectRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use('/projects', ProjectRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
