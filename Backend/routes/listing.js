import express from 'express';
import { analyzeListing, createListing } from '../controllers/listing.js';
import { protect, farmerOnly } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Route for the AI analysis step. It's protected and for farmers only.
// 'upload.single('image')' middleware processes a single file upload with the field name 'image'.
router.post('/analyze', protect, farmerOnly, upload.single('image'), analyzeListing);

// Route to finally create the listing in the database after farmer confirms.
router.post('/', protect, farmerOnly, createListing);

export default router;