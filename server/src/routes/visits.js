import express from 'express';
import Visit from '../models/Visit.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Visit.find()
    .populate({
      path: 'guardian',
      select: 'firstName lastName relationship'
    })
    .populate({
      path: 'resident',
      select: 'firstName lastName facility',
      populate: {
        path: 'facility',
        select: 'name city state'
      }
    });

  res.json(items);
});

router.post('/', async (req, res) => {
  const item = await Visit.create(req.body);

  const populated = await Visit.findById(item._id)
    .populate({
      path: 'guardian',
      select: 'firstName lastName relationship'
    })
    .populate({
      path: 'resident',
      select: 'firstName lastName facility',
      populate: {
        path: 'facility',
        select: 'name city state'
      }
    });

  res.status(201).json(populated);
});

router.patch('/:id', async (req, res) => {
  const item = await Visit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
    .populate({
      path: 'guardian',
      select: 'firstName lastName relationship'
    })
    .populate({
      path: 'resident',
      select: 'firstName lastName facility',
      populate: {
        path: 'facility',
        select: 'name city state'
      }
    });

  res.json(item);
});

router.delete('/:id', async (req, res) => {
  await Visit.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;