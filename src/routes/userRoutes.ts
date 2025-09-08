import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController.ts';

const router = Router();

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', registerUser);

// @desc    Log in a user
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);

export default router;
