import express from 'express';
import cors from 'cors';
import { dbConnected } from './db.js';
import doctorsRouter from './routes/doctors.js';
import metaRouter from './routes/meta.js';
import appointmentsRouter from './routes/appointments.js';
import joinRouter from './routes/join.js';

const app = express();

app.use(cors());
app.use(express.json());

function requireDB(_req, res, next) {
  if (!dbConnected()) {
    return res.status(503).json({ error: 'Database not connected. Start MongoDB and run `npm run seed`.' });
  }
  next();
}

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: dbConnected() ? 'connected' : 'disconnected' }),
);

// require a live DB for data routes so the client can fall back cleanly
app.use('/api/doctors', requireDB, doctorsRouter);
app.use('/api/appointments', requireDB, appointmentsRouter);
app.use('/api/join', requireDB, joinRouter);
app.use('/api', requireDB, metaRouter);

// error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
