import serverless from 'serverless-http';
import app from '../../server/src/app.js';
import { ensureDB } from '../../server/src/ensureDb.js';

const wrapped = serverless(app);

export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await ensureDB();
  } catch (err) {
    console.error('DB connect failed:', err.message);
    globalThis.__dbErr = `${err.name}: ${err.message}`.slice(0, 200);
    // app's requireDB middleware will answer 503 and the client falls back
  }
  return wrapped(event, context);
};
