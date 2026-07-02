import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

// ── Strip dangerous characters from all string inputs ─────
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove scripts
        .replace(/javascript:/gi, '')   // remove javascript: URLs
        .replace(/on\w+\s*=/gi, '')     // remove event handlers like onclick=
        .trim();
    }
    if (Array.isArray(obj)) return obj.map(sanitizeObject);
    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, sanitizeObject(v)])
      );
    }
    return obj;
  };

  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query) as any;
  next();
};

// ── Prevent NoSQL injection ───────────────────────────────
export const preventInjection = (req: Request, res: Response, next: NextFunction) => {
  const hasInjection = (obj: any): boolean => {
    if (typeof obj === 'string') return obj.includes('$') || obj.includes('{');
    if (Array.isArray(obj)) return obj.some(hasInjection);
    if (obj && typeof obj === 'object') return Object.values(obj).some(hasInjection);
    return false;
  };

  if (hasInjection(req.body) || hasInjection(req.query)) {
    res.status(400).json({ message: 'Invalid characters in request' });
    return;
  }
  next();
};

// ── Validate register input ───────────────────────────────
export const validateRegister: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and a number'),
];

// ── Validate login input ──────────────────────────────────
export const validateLogin: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Validate order input ──────────────────────────────────
export const validateOrder: ValidationChain[] = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\s-]{10,15}$/).withMessage('Invalid phone number'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.province').trim().notEmpty().withMessage('Province is required'),
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty().withMessage('Postal code is required')
    .matches(/^\d{4}$/).withMessage('Invalid SA postal code'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
];

// ── Run validation and return errors ─────────────────────
export const handleValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.type, message: e.msg })),
    });
    return;
  }
  next();
};