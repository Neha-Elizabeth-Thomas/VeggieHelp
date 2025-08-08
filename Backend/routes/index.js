import express from 'express';
import userRoutes from './user.js'; // Import the user-specific routes
import listingRoutes from './listing.js'; // 1. Import listing routes
import chatRoutes from './chat.js'; // 1. Import listing routes
import paymentRoutes from './payment.js'; // 1. Import payment routes
import cartRoutes from './cart.js';

const router = express.Router();

// This is the central switchboard.
// Any request that comes to /api/users will be forwarded to the userRoutes handler.
router.use('/users', userRoutes);
router.use('/listings', listingRoutes); // 2. Add listing routes to the switchboard
router.use('/chat', chatRoutes);
router.use('/payment', paymentRoutes);
router.use('/cart', cartRoutes);

export default router;
