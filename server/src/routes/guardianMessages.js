import express from 'express';
import GuardianMessage from '../models/GuardianMessage.js';

const router = express.Router();

/**
 * GET ALL MESSAGES
 */
router.get('/', async (req, res, next) => {
  try {
    const items = await GuardianMessage.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'guardian',
        select:
          'firstName lastName relationship phone email'
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
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE MESSAGE
 */
router.post('/', async (req, res, next) => {
  try {
    const item = await GuardianMessage.create(req.body);

    const populated =
      await GuardianMessage.findById(item._id)
        .populate({
          path: 'guardian',
          select:
            'firstName lastName relationship phone email'
        })
        .populate({
          path: 'resident',
          select:
            'firstName lastName facility',
          populate: {
            path: 'facility',
            select: 'name city state'
          }
        });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

/**
 * UPDATE MESSAGE
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const item =
      await GuardianMessage.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      )
        .populate({
          path: 'guardian',
          select:
            'firstName lastName relationship phone email'
        })
        .populate({
          path: 'resident',
          select:
            'firstName lastName facility',
          populate: {
            path: 'facility',
            select: 'name city state'
          }
        });

    if (!item) {
      return res
        .status(404)
        .json({
          error: 'Message not found'
        });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE MESSAGE
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const item =
      await GuardianMessage.findByIdAndDelete(
        req.params.id
      );

    if (!item) {
      return res
        .status(404)
        .json({
          error: 'Message not found'
        });
    }

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;