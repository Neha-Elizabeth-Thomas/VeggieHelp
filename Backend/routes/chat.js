import express from 'express';
import { handleChatMessage } from '../controllers/chat.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// A protected route for handling chat messages.
// Only logged-in users can access the chatbot.
router.post('/', protect, handleChatMessage);

export default router;