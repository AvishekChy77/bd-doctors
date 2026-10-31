import { Router } from 'express';
import Application from '../models/Application.js';

const router = Router();

// POST /api/join — doctor listing application
router.post('/', async (req, res, next) => {
  try {
    const { name, bmdcRegNo, specialty, phone } = req.body ?? {};
    if (!name || !bmdcRegNo || !specialty || !phone) {
      return res.status(400).json({ ok: false, error: 'name, bmdcRegNo, specialty and phone are required' });
    }
    const app = await Application.create(req.body);
    res.status(201).json({ ok: true, id: app._id, status: app.status });
  } catch (err) {
    next(err);
  }
});

export default router;
