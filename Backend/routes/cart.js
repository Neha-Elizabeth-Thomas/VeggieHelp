import express from 'express';
import { getCart, addToCart, removeFromCart, updateItemQuantity } from '../controllers/cart.js';
import { protect } from '../middlewares/auth.js'; // Assuming you have a buyerOnly middleware

const router = express.Router();

router.use(protect); // All cart routes are protected

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateItemQuantity);
router.delete('/remove/:listingId', removeFromCart);

export default router;