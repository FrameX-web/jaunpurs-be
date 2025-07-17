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
import Contact from './models/Contact.js';
import Enquiry from './models/Enquiry.js';

console.log('Contact model loaded:', !!Contact);
console.log('Enquiry model loaded:', !!Enquiry);

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    // Optionally, check if models are compiled
    if (!Contact || !Enquiry) {
      console.error('Model import failed: Contact or Enquiry is undefined');
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

// Contact Form Route
app.post('/api/contact', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Enquiry Form Route (JSON only, no file upload)
app.post('/api/enquiry', async (req, res) => {
  try {
    const { name, phone, email, country, message } = req.body;
    const enquiryData = { name, phone, email, country, message };
    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();
    return res.status(201).json({ message: 'Enquiry form submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit enquiry form' });
  }
});

// Admin: Get all contact form data
app.get('/api/admin/contacts', async (req, res) => {
  try {
    if (!Contact) {
      throw new Error('Contact model is not defined');
    }
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('--- ERROR FETCHING CONTACTS ---');
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    if (err.errors) console.error('Errors:', err.errors);
    if (err.reason) console.error('Reason:', err.reason);
    res.status(500).json([]);
  }
});

// Admin: Get all enquiry data (without file buffer)
app.get('/api/admin/enquiries', async (req, res) => {
  try {
    if (!Enquiry) {
      throw new Error('Enquiry model is not defined');
    }
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
