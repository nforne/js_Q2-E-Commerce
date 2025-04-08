import { Router } from 'express';
import { signIn } from '../controllers/user.Controller.js';
import { signOut } from '../controllers/auth.Controller.js';

const router = Router();

// User sign-in (generate JWT)
router.post('/signin', signIn);

// User sign-out (invalidate JWT client-side)
router.post('/signout', signOut);

export default router;
