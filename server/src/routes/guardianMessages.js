import express from 'express';
import GuardianMessage from '../models/GuardianMessage.js';
import {
  requireAuth,
  requireGuardian,
} from '../middleware/auth.js';
const router = express.Router();

/**
 * GET ALL MESSAGES
 */
router.get('/', requireAuth, async (req, res, next) => {
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

router.get(
  '/resident/:residentId',
  requireGuardian,
  async (req, res, next) => {
    try {
      const items = await GuardianMessage.find({
        resident: req.params.residentId,
      })
        .sort({ createdAt: 1 })
        .populate({
          path: 'guardian',
          select:
            'firstName lastName relationship phone email',
        })
        .populate({
          path: 'resident',
          select: 'firstName lastName facility',
          populate: {
            path: 'facility',
            select: 'name city state',
          },
        });

      res.json(items);
    } catch (err) {
      next(err);
    }
  }
);
/**
 * GET MESSAGES FOR A GUARDIAN
 */
router.get('/guardian/:guardianId', async (req, res, next) => {
  try {
    const items = await GuardianMessage.find({
      guardian: req.params.guardianId,
    })
      .sort({ createdAt: 1 })
      .populate({
        path: 'guardian',
        select: 'firstName lastName relationship phone email',
      })
      .populate({
        path: 'resident',
        select: 'firstName lastName facility',
        populate: {
          path: 'facility',
          select: 'name city state',
        },
      });

    res.json(items);
  } catch (err) {
    next(err);
  }
});



/**
 * CREATE MESSAGE
 */
router.post('/',  requireGuardian, async (req, res, next) => {
  try {
const item = await GuardianMessage.create({
  guardian: req.guardian._id,
  resident: req.guardian.resident._id,
  sender: 'Guardian',
  message: req.body.message,
});
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
 * STAFF REPLY
 */
router.post('/reply', requireAuth, async (req, res, next) => {
  try {
    const item = await GuardianMessage.create({
      guardian: req.body.guardian,
      resident: req.body.resident,
      sender: 'Staff',
      message: req.body.message,
    });

    const populated = await GuardianMessage.findById(item._id)
      .populate({
        path: 'guardian',
        select: 'firstName lastName relationship phone email',
      })
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
 * UPDATE MESSAGE
 */
router.patch('/:id', requireAuth, async (req, res, next) => {
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
 * MARK MESSAGE AS READ
 */
router.patch('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const item = await GuardianMessage.findByIdAndUpdate(
      req.params.id,
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        error: 'Message not found',
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
router.delete('/:id',  requireAuth, async (req, res, next) => {
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