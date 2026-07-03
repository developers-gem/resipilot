import express from 'express';
import Visit from '../models/Visit.js';
import {
  requireAuth,
  requireGuardian,
} from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
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

router.get(
  '/resident/:residentId',
  requireGuardian,
  async (req, res, next) => {
    try {
      const visits = await Visit.find({
        resident: req.params.residentId,
      })
        .populate({
          path: 'guardian',
          select: 'firstName lastName relationship',
        })
        .populate({
          path: 'resident',
          select: 'firstName lastName facility',
          populate: {
            path: 'facility',
            select: 'name city state',
          },
        })
        .sort('-scheduledFor');

      res.json(visits);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/', requireGuardian, async (req, res) => {
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

router.patch('/:id', requireAuth, async (req, res) => {
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

router.patch('/:id/approve', requireAuth, async (req, res, next) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedAt: new Date(),
        // approvedBy: req.user._id (later)
      },
      {
        new: true,
      }
    )
      .populate('guardian')
      .populate('resident');

    res.json(visit);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/reject', requireAuth, async (req, res, next) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
      },
      {
        new: true,
      }
    )
      .populate('guardian')
      .populate('resident');

    res.json(visit);
  } catch (err) {
    next(err);
  }
});
router.delete('/:id', requireAuth, async (req, res) => {
  await Visit.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;