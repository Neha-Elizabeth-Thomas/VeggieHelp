import express from 'express';
import userRoutes from './user.js'; // Import the user-specific routes

const router = express.Router();

// This is the central switchboard.
// Any request that comes to /api/users will be forwarded to the userRoutes handler.
router.use('/users', userRoutes);

// You can add more routes here later, for example:
// import listingRoutes from './listing.routes.js';
// router.use('/listings', listingRoutes);

export default router;
