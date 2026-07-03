import bcrypt from 'bcryptjs';
import express from 'express';
import Guardian from '../models/Guardian.js';

const router = express.Router();

/**
 * GET ALL GUARDIANS
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await Guardian.find()
      .populate({
        path: 'resident',
        select: 'firstName lastName facility',
        populate: {
          path: 'facility',
          select: 'name city state'
        }
      });

    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE GUARDIAN
 */
router.post('/', async (req, res, next) => {
  try {
    const { password, ...guardianData } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const item = await Guardian.create({
      ...guardianData,
      passwordHash,
    });

    const populated = await Guardian.findById(item._id)
      .populate({
        path: 'resident',
        select: 'firstName lastName facility',
        populate: {
          path: 'facility',
          select: 'name city state',
        },
      });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

/**
 * UPDATE GUARDIAN
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const item = await Guardian.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate({
      path: 'resident',
      select: 'firstName lastName facility',
      populate: {
        path: 'facility',
        select: 'name city state'
      }
    });

    if (!item) {
      return res
        .status(404)
        .json({ error: 'Guardian not found' });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE GUARDIAN
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await Guardian.findByIdAndDelete(
      req.params.id
    );

    if (!item) {
      return res
        .status(404)
        .json({ error: 'Guardian not found' });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;