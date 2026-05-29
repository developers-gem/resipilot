import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { requireAuth } from '../middleware/auth.js';
import { Document } from '../models/index.js';

const router = Router();

router.use(requireAuth);

// =============================
// UPLOAD DIRECTORY
// =============================

const uploadDir = 'uploads/documents';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// =============================
// MULTER CONFIG
// =============================

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

      'application/msword',

      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

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
          'Only PDF, DOC, DOCX, JPG and PNG files are allowed'
        )
      );
    }
  },
});

// =============================
// GET ALL DOCUMENTS
// =============================

router.get(
  '/',
  async (req, res, next) => {
    try {
      const docs =
        await Document.find()
          .populate('resident')
          .populate('facility')
          .populate('uploadedBy')
          .sort('-createdAt');

      res.json(docs);
    } catch (e) {
      next(e);
    }
  }
);

// =============================
// GET ONE DOCUMENT
// =============================

router.get(
  '/:id',
  async (req, res, next) => {
    try {
      const doc =
        await Document.findById(
          req.params.id
        )
          .populate('resident')
          .populate('facility')
          .populate('uploadedBy');

      if (!doc) {
        return res
          .status(404)
          .json({
            error:
              'Document not found',
          });
      }

      res.json(doc);
    } catch (e) {
      next(e);
    }
  }
);

// =============================
// CREATE DOCUMENT
// =============================

router.post(
  '/',
  upload.single('file'),
  async (req, res, next) => {
    try {
      const doc =
        await Document.create({
          resident:
            req.body.resident,

          facility:
            req.body.facility,

          uploadedBy:
            req.user?._id,

          title: req.body.title,

          description:
            req.body.description,

          category:
            req.body.category,

          documentDate:
            req.body.documentDate,

          requiresESign:
            req.body.requiresESign,

          status:
            req.body.status ||
            'Awaiting',

          fileUrl: req.file
            ? '/' +
              req.file.path.replace(
                /\\/g,
                '/'
              )
            : req.body.fileUrl,

          fileSizeBytes:
            req.file?.size,

          mimeType:
            req.file?.mimetype,

          isConfidential:
            req.body
              .isConfidential ===
            'true',

          signatureProvider:
            req.body
              .signatureProvider,
        });

      const populated =
        await Document.findById(
          doc._id
        )
          .populate('resident')
          .populate('facility')
          .populate('uploadedBy');

      res
        .status(201)
        .json(populated);
    } catch (e) {
      next(e);
    }
  }
);

// =============================
// UPDATE DOCUMENT
// =============================

router.patch(
  '/:id',
  async (req, res, next) => {
    try {
      const doc =
        await Document.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        )
          .populate('resident')
          .populate('facility')
          .populate('uploadedBy');

      if (!doc) {
        return res
          .status(404)
          .json({
            error:
              'Document not found',
          });
      }

      res.json(doc);
    } catch (e) {
      next(e);
    }
  }
);

// =============================
// DELETE DOCUMENT
// =============================

router.delete(
  '/:id',
  async (req, res, next) => {
    try {
      const doc =
        await Document.findById(
          req.params.id
        );

      if (!doc) {
        return res
          .status(404)
          .json({
            error:
              'Document not found',
          });
      }

      if (doc.fileUrl) {
        const filePath =
          doc.fileUrl.replace(
            /^\//,
            ''
          );

        if (
          fs.existsSync(filePath)
        ) {
          fs.unlinkSync(
            filePath
          );
        }
      }

      await doc.deleteOne();

      res.json({
        ok: true,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default router;