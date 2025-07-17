import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  country: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Enquiry', enquirySchema);
});

export default mongoose.model('Enquiry', enquirySchema);
