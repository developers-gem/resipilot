import express from 'express';
import Guardian from '../models/Guardian.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const items = await Guardian.find()
    .populate('resident', 'firstName lastName');

  res.json(items);
});

router.post('/', async (req, res) => {
  const item = await Guardian.create(req.body);

  const populated = await Guardian.findById(item._id)
    .populate('resident', 'firstName lastName');

  res.status(201).json(populated);
});

router.patch('/:id', async (req, res) => {
  const item = await Guardian.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  ).populate('resident', 'firstName lastName');

  res.json(item);
});

router.delete('/:id', async (req, res) => {
  await Guardian.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;