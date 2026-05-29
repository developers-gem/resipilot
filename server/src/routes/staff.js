import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Staff } from '../models/index.js';

const router = Router();

router.use(requireAuth);

// GET STAFF
router.get('/', async (req, res, next) => {
  try {
    const docs = await Staff.find()
      .populate('facility')
      .sort('-createdAt');

    res.json(docs);
  } catch (e) {
    next(e);
  }
});

// CREATE STAFF
router.post('/', async (req, res, next) => {
  try {
    const doc = await Staff.create(req.body);

    const populated = await Staff.findById(doc._id)
      .populate('facility');

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
});

// DELETE STAFF
router.delete('/:id', async (req, res, next) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;