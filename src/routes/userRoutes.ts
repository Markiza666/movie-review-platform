import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/userController.ts';

const router = Router();

// --- PUBLIC ROUTES ---
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
