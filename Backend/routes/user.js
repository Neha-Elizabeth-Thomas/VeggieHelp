import express from 'express';
import { 
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile
} from '../controllers/user.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected route
// When a GET request is made to /api/users/profile, it first runs the `protect` middleware.
// If the user is authenticated, it then proceeds to the `getUserProfile` controller.
router.get('/profile', protect, getUserProfile);


export default router;