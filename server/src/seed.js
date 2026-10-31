import 'dotenv/config';
import mongoose from 'mongoose';
import { MONGODB_URI } from './db.js';
import Doctor from './models/Doctor.js';
import { DOCTORS } from './data/doctors.js';

try {
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log(`Connected to ${MONGODB_URI}`);

  await Doctor.deleteMany({});
  const inserted = await Doctor.insertMany(DOCTORS);
  console.log(`🌱 Seeded ${inserted.length} doctors.`);
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
