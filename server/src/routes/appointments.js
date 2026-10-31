import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';

const router = Router();

// POST /api/appointments
router.post('/', async (req, res, next) => {
  try {
    const { doctorSlug, chamberName, name, phone, preferredDay = '', note = '' } = req.body ?? {};
    if (!doctorSlug || !name || !phone) {
      return res.status(400).json({ ok: false, error: 'doctorSlug, name and phone are required' });
    }
    const doctor = await Doctor.findOne({ slug: doctorSlug }).lean();
    if (!doctor) return res.status(404).json({ ok: false, error: 'Unknown doctor' });

    const appt = await Appointment.create({ doctorSlug, chamberName, name, phone, preferredDay, note });
    res.status(201).json({ ok: true, id: appt._id, status: appt.status });
  } catch (err) {
    next(err);
  }
});

// GET /api/appointments?doctorSlug= — simple admin/debug listing
router.get('/', async (req, res, next) => {
  try {
    const filter = req.query.doctorSlug ? { doctorSlug: req.query.doctorSlug } : {};
    const rows = await Appointment.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
