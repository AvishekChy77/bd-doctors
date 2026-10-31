import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    doctorSlug: { type: String, required: true, index: true },
    chamberName: String,
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    preferredDay: { type: String, enum: ['', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    note: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  },
  { timestamps: true },
);

export default mongoose.model('Appointment', appointmentSchema);
