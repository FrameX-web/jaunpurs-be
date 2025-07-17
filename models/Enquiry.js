import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  country: String,
  message: String,
  fileName: String, // uploaded file name
  file: { type: Buffer, select: false },     // uploaded file data as Buffer (binary)
  fileType: String, // uploaded file mimetype
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Enquiry', enquirySchema);
