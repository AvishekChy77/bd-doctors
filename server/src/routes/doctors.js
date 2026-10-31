import { Router } from 'express';
import Doctor from '../models/Doctor.js';

const router = Router();

// GET /api/doctors?q=&specialty=&district=&gender=&day=&maxFee=&sort=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { q, specialty, district, gender, day, maxFee, sort, page = 1, limit = 60 } = req.query;

    const filter = {};
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: rx },
        { nameBn: rx },
        { specialty: rx },
        { workplace: rx },
        { designation: rx },
        { 'chambers.name': rx },
        { 'chambers.address': rx },
      ];
    }
    if (specialty) filter.specialty = specialty;
    if (district) filter['chambers.district'] = district;
    if (gender) filter.gender = gender;
    if (day) filter['chambers.schedule.day'] = day;

    let sortSpec = { rating: -1 };
    if (sort === 'experience') sortSpec = { experienceYears: -1 };
    if (sort === 'fee-asc') sortSpec = { 'chambers.0.fee': 1 };

    let docs = await Doctor.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    if (maxFee) {
      docs = docs.filter((d) => Math.min(...d.chambers.map((c) => c.fee)) <= Number(maxFee));
    }

    res.json({ doctors: docs, total: docs.length, page: Number(page) });
  } catch (err) {
    next(err);
  }
});

// POST /api/doctors/:slug/reviews
router.post('/:slug/reviews', async (req, res, next) => {
  try {
    const { name, rating, comment = '' } = req.body ?? {};
    const numRating = Number(rating);
    if (!name || !numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ ok: false, error: 'name and rating (1–5) are required' });
    }
    const doctor = await Doctor.findOne({ slug: req.params.slug });
    if (!doctor) return res.status(404).json({ ok: false, error: 'Unknown doctor' });

    doctor.reviews.unshift({
      name,
      rating: numRating,
      comment,
      date: new Date().toISOString().slice(0, 10),
    });
    doctor.reviewsCount = (doctor.reviewsCount ?? 0) + 1;
    const avg = doctor.reviews.reduce((s, r) => s + r.rating, 0) / doctor.reviews.length;
    doctor.rating = Math.round(avg * 10) / 10;
    await doctor.save();

    res.status(201).json({ ok: true, rating: doctor.rating, reviewsCount: doctor.reviewsCount });
  } catch (err) {
    next(err);
  }
});

// GET /api/doctors/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const doc = await Doctor.findOne({ slug: req.params.slug }).lean();
    if (!doc) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

export default router;
