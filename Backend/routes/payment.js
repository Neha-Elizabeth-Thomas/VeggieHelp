import express from 'express';
import { createOrder, verifyPayment } from '../controllers/payment.js';
import { protect } from '../middlewares/auth.js'; // Assuming you have a buyerOnly middleware

const router = express.Router();

// Protected routes, accessible only by logged-in users (buyers)
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;