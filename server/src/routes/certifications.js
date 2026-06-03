import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import {
  StaffCertification
} from '../models/index.js';

const router = Router();

router.use(requireAuth);

// =====================================
// UPLOAD DIRECTORY
// =====================================

const uploadDir = 'uploads/certifications';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================================
// MULTER CONFIG
// =====================================

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    const unique =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9);

    cb(
      null,
      unique +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    const allowed = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (
      allowed.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only PDF, JPG and PNG files are allowed'
        )
      );
    }
  },
});

// =====================================
// GET CERTIFICATIONS
// =====================================

router.get('/', async (req, res, next) => {
  try {
    const docs =
      await StaffCertification.find()
        .populate('staff')
        .populate('course')
        .sort('-createdAt');

    res.json(docs);
  } catch (e) {
    next(e);
  }
});

// =====================================
// CREATE CERTIFICATION
// =====================================

router.post(
  '/',
  upload.single('certificate'),
  async (req, res, next) => {
    try {
      const doc =
        await StaffCertification.create({
          staff: req.body.staff,
          course: req.body.course,
          certName: req.body.certName,
          issuedOn: req.body.issuedOn,
          expiresOn: req.body.expiresOn,
          status:
            req.body.status || 'valid',

          certificateUrl: req.file
            ? '/' +
              req.file.path.replace(
                /\\/g,
                '/'
              )
            : null,
        });

      const populated =
        await StaffCertification.findById(
          doc._id
        )
          .populate('staff')
          .populate('course');

      res.status(201).json(populated);
    } catch (e) {
      next(e);
    }
  }
);

// =====================================
// DELETE CERTIFICATION
// =====================================

router.delete('/:id', async (req, res, next) => {
  try {
    const doc =
      await StaffCertification.findById(
        req.params.id
      );

    if (!doc) {
      return res.status(404).json({
        error: 'Certification not found',
      });
    }

    if (doc.certificateUrl) {
      const filePath =
        doc.certificateUrl.replace(
          /^\//,
          ''
        );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await doc.deleteOne();

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;