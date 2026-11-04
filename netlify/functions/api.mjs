import serverless from 'serverless-http';
import mongoose from 'mongoose';
import app from '../../server/src/app.js';

const wrapped = serverless(app);

/** Reuse the MongoDB connection across warm invocations. */
let connecting = null;

async function ensureDB() {
  if (mongoose.connection.readyState === 1) return;
  connecting ??= mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .catch((err) => {
      connecting = null;
      throw err;
    });
  await connecting;
}

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await ensureDB();
  } catch (err) {
    console.error('DB connect failed:', err.message);
    // app's requireDB middleware will answer 503 and the client falls back
  }
  return wrapped(event, context);
};
