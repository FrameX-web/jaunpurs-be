// Simple Express backend server with MongoDB Atlas connection
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'your_mongodb_atlas_connection_string_here';
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI environment variable is NOT set!');
} else {
  console.log('MONGO_URI environment variable is set.');
}

app.use(cors());
app.use(express.json());

// Import models
import Enquiry from './models/Enquiry.js';
// Add Feedback model import
import Feedback from './models/Feedback.js';

console.log('Enquiry model loaded:', !!Enquiry);

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Optionally, check if models are compiled
    if (!Enquiry) {
      console.error('Model import failed: Enquiry is undefined');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Health check endpoint for backend/frontend connectivity
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running and reachable.' });
});

// Example route
app.get('/', (req, res) => {
  res.send('Backend server is running and connected to MongoDB!');
});

// Enquiry Form Route (JSON only, no file upload)
app.post('/api/enquiry', async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const enquiryData = { name, phone, message };
    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();
    return res.status(201).json({ message: 'Enquiry form submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit enquiry form' });
  }
});

// Feedback Form Route
app.post('/api/feedback', async (req, res) => {
  try {
    // Log incoming request for debugging
    console.log('Received feedback:', req.body);

    const {
      name,
      mobile,
      overallExperience,
      whatDidYouTry,
      comments,
      foodQuality,
      serviceStaff,
      whatsappUpdates,
      whatsappNumber
    } = req.body;

    // Validate required fields (including name and mobile)
    if (
      !name ||
      !mobile ||
      !overallExperience ||
      !Array.isArray(whatDidYouTry) || whatDidYouTry.length === 0 ||
      !foodQuality ||
      !serviceStaff ||
      !whatsappUpdates ||
      (whatsappUpdates === "Yes" && (!whatsappNumber || !/^\d{10}$/.test(whatsappNumber)))
    ) {
      return res.status(400).json({
        error: "Missing or invalid required fields. Please fill all required fields correctly."
      });
    }

    const feedbackData = {
      name,
      mobile,
      overallExperience,
      whatDidYouTry,
      comments,
      foodQuality,
      serviceStaff,
      whatsappUpdates,
      whatsappNumber
    };
    const feedback = new Feedback(feedbackData);
    await feedback.save();
    return res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission error:', err);
    // If validation error, send details
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Admin: Get all enquiry data (without file buffer)
app.get('/api/admin/enquiries', async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error('--- ERROR FETCHING ENQUIRIES ---');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    if (err.errors) console.error('Errors:', err.errors);
    if (err.reason) console.error('Reason:', err.reason);
    res.status(500).json([]);
  }
});

// Admin: Get all feedback data
app.get('/api/admin/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
