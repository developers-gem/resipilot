import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  StaffCertification
} from '../models/index.js';

const router = Router();

router.use(requireAuth);

// GET certifications with populated refs
router.get('/', async (req, res, next) => {
  try {
    const docs = await StaffCertification.find()
      .populate('staff')
      .populate('course')
      .sort('-createdAt');

    res.json(docs);
  } catch (e) {
    next(e);
  }
});

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const doc = await StaffCertification.create(req.body);

    const populated = await StaffCertification.findById(doc._id)
      .populate('staff')
      .populate('course');

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    await StaffCertification.findByIdAndDelete(req.params.id);

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;