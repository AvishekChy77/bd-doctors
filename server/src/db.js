import mongoose from 'mongoose';

export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bd_doctors';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    console.log(`✅ MongoDB connected → ${MONGODB_URI}`);
    return true;
  } catch (err) {
    console.warn(`⚠️  MongoDB not reachable (${err.message}).`);
    console.warn('   API will report db:"disconnected"; the client falls back to sample data.');
    return false;
  }
}

export const dbConnected = () => mongoose.connection.readyState === 1;
