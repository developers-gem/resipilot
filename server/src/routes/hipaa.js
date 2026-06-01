import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { HipaaAccessLog } from '../models/index.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const logs = await HipaaAccessLog.find()
      .sort('-timestamp');

    res.json(logs);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const log = await HipaaAccessLog.create(
      req.body
    );

    res.status(201).json(log);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await HipaaAccessLog.findByIdAndDelete(
      req.params.id
    );

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;