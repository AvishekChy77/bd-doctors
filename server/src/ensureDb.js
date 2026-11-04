import mongoose from 'mongoose';

/**
 * Lazy, cached connect for serverless environments. Lives inside server/src
 * so it resolves the SAME mongoose instance as the models and db.js.
 */
let connecting = null;

export async function ensureDB() {
  if (mongoose.connection.readyState === 1) return;
  connecting ??= mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    .catch((err) => {
      connecting = null;
      throw err;
    });
  await connecting;
}
