import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { LicensingRecord } from '../models/index.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const docs = await LicensingRecord.find()
      .populate('facility')
      .sort('-createdAt');

    res.json(docs);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const doc = await LicensingRecord.create(req.body);

    const populated = await LicensingRecord.findById(doc._id)
      .populate('facility');

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const doc = await LicensingRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('facility');

    res.json(doc);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await LicensingRecord.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;