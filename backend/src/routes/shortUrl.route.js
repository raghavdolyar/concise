import express from 'express';
import { body, validationResult } from 'express-validator';
import { createShortUrl } from '../controller/shortUrl.controller.js';

const router = express.Router();

const validateUrl = [
  body('url')
    .isURL({ require_protocol: true })
    .withMessage('Please provide a valid URL including http:// or https://')
    .customSanitizer((value) => {
      return value && value.endsWith('/') ? value.slice(0, -1) : value;
    }),
  body('slug')
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 3, max: 20 })
    .withMessage('Custom slug must be between 3 and 20 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    next();
  },
];

router.post('/', validateUrl, createShortUrl);

export default router;
