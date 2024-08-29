import { Router } from 'express';
import {
  signup,
  login,
  logout,
  // authz,
  // protect,
} from '../controllers/authController.js';
import {
  validEmail,
  requiredBody,
  checkErrors,
  confirmPassword,
  passwordMinLength,
} from '../utils/validatorHelper.js';

const router = Router();

router.post(
  '/signup',
  requiredBody('name'),
  requiredBody('email'),
  requiredBody('password'),
  requiredBody('passwordConfirm'),
  validEmail(),
  passwordMinLength(),
  confirmPassword(),
  checkErrors,
  signup
);

router.post(
  '/login',
  requiredBody('email'),
  requiredBody('password'),
  validEmail(),
  login
);

router.post('/logout', logout);

// admin routes
// router.use(authz('admin'));
// router.route('/').get(getAllUsers);
// router
//   .route('/:id')
//   .get(getUserWithArtworks)
//   .patch(updateUser)
//   .delete(deleteUser);

export default router;
