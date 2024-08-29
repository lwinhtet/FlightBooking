import { Router } from 'express';
import { query } from 'express-validator';
import {
  sanitizeQueryParamsAllFlights,
  getAllFlights,
  getFlight,
} from '../controllers/flightController.js';
import {
  isIdInt,
  requiredParam,
  checkErrors,
} from '../utils/validatorHelper.js';
import TripType from '../constants/tripType.js';

const router = Router();

router.route('/').get(
  sanitizeQueryParamsAllFlights,
  requiredParam('origin'),
  requiredParam('destination'),
  query('returnDate')
    .if((value, { req }) => req.query.tripType === TripType.ROUND_TRIP)
    .trim()
    .notEmpty()
    .withMessage(`returnDate is missing`)
    .escape(),
  // requiredParam('returnDate'),
  requiredParam('departureDate'),
  checkErrors,
  getAllFlights
);

router.route('/:id').get(isIdInt(), checkErrors, getFlight);

export default router;
