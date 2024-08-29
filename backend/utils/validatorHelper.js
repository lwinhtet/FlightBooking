import { query, param, body, validationResult } from 'express-validator';
import AppError from './appError.js';

export const requiredParam = (field) =>
  query(field).trim().notEmpty().withMessage(`${field} is missing`).escape();

export const requiredBody = (field) =>
  body(field).trim().notEmpty().withMessage(`${field} is missing`).escape();

export const validEmail = () =>
  body('email').isEmail().withMessage('Please provide a valid email address');

export const passwordMinLength = () =>
  body('password')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters long');

export const confirmPassword = () =>
  body('passwordConfirm')
    .custom((value, { req }) => {
      console.log(req.body.password);
      console.log(value);
      return value === req.body.password;
    })
    .withMessage('Passwords do not match');

export const isIdInt = () =>
  param('id').isInt().withMessage('ID must be an integer');

export const checkErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new AppError(result.array().at(0).msg, 400));
  }
  next();
};
