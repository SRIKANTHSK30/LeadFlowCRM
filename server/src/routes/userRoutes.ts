import { Router } from 'express';
import { auth } from '../middleware/auth';
import { getProfile, getUsers } from '../controllers/userController';

const router = Router();

router.get('/profile', auth, getProfile);
router.get('/', auth, getUsers);

export default router;