import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import { saveBooking } from '../controllers/bookingController.js';

const router = Router();

router.route('/').post(protect, saveBooking);

export default router;
