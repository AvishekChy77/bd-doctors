import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    bmdcRegNo: { type: String, required: true, trim: true, maxlength: 40 },
    specialty: { type: String, required: true },
    district: String,
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, trim: true, maxlength: 120 },
    degrees: { type: String, trim: true, maxlength: 300 },
    chamberInfo: { type: String, trim: true, maxlength: 500 },
    message: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  },
  { timestamps: true },
);

export default mongoose.model('Application', applicationSchema);
