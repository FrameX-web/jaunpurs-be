import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  overallExperience: { type: String, required: true },
  whatDidYouTry: [{ type: String, required: true }],
  comments: { type: String, default: '' },
  foodQuality: { type: String, required: true },
  serviceStaff: { type: String, required: true },
  whatsappUpdates: { type: String, required: true },
  whatsappNumber: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Feedback', FeedbackSchema);
