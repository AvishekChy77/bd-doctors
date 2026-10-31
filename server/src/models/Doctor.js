import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    day: { type: String, enum: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], required: true },
    start: { type: String, required: true }, // "18:00"
    end: { type: String, required: true },
  },
  { _id: false },
);

const chamberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: String,
    district: { type: String, index: true },
    room: String,
    phone: String,
    fee: { type: Number, default: 0 },
    followUpFee: Number,
    schedule: [scheduleSchema],
  },
  { _id: false },
);

const doctorSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    nameBn: String,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    specialty: { type: String, required: true, index: true },
    degrees: [String],
    designation: String,
    workplace: String,
    experienceYears: Number,
    languages: [String],
    bmdcRegNo: String,
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    phone: String,
    email: String,
    about: String,
    chambers: [chamberSchema],
  },
  { timestamps: true },
);

doctorSchema.index({
  name: 'text',
  nameBn: 'text',
  specialty: 'text',
  workplace: 'text',
  'chambers.name': 'text',
  'chambers.address': 'text',
});

export default mongoose.model('Doctor', doctorSchema);
