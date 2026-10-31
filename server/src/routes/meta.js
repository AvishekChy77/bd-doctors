import { Router } from 'express';
import Doctor from '../models/Doctor.js';

const router = Router();

// GET /api/specialties — names with doctor counts
router.get('/specialties', async (_req, res, next) => {
  try {
    const rows = await Doctor.aggregate([
      { $group: { _id: '$specialty', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /api/stats — hero counters
router.get('/stats', async (_req, res, next) => {
  try {
    const [row] = await Doctor.aggregate([
      {
        $group: {
          _id: null,
          doctors: { $sum: 1 },
          specialties: { $addToSet: '$specialty' },
          chambers: { $sum: { $size: '$chambers' } },
          districts: { $addToSet: '$chambers.district' },
        },
      },
      {
        $project: {
          _id: 0,
          doctors: 1,
          chambers: 1,
          specialties: { $size: '$specialties' },
          districts: {
            $size: {
              $reduce: {
                input: '$districts',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      },
    ]);
    res.json(row ?? { doctors: 0, specialties: 0, chambers: 0, districts: 0 });
  } catch (err) {
    next(err);
  }
});

export default router;
