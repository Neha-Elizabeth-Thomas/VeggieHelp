import Listing from '../models/listing.js';
import cloudinary from '../config/cloudinary.js';
import { analyzeProduceWithGemini } from '../services/gemini.js';

/**
 * @desc    Analyze produce description and image
 * @route   POST /api/listings/analyze
 * @access  Private/Farmer
 */
export const analyzeListing = async (req, res) => {
    const farmerText = req.body.text;
    const file = req.file; // The image file from multer

    if (!farmerText || !file) {
        return res.status(400).json({ message: 'Description text and an image are required.' });
    }

    try {
        // 1. Upload image to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: 'subzisahayak' },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ message: 'Failed to upload image.' });
                }

                // 2. Call Gemini API with text and the public image URL from Cloudinary
                const imageUrl = result.secure_url;
                const analysisResult = await analyzeProduceWithGemini(farmerText, imageUrl, req.user.location);
                
                // 3. Send the complete analysis back to the frontend for confirmation
                res.status(200).json({
                    ...analysisResult,
                    imageUrl: imageUrl // Also send the image URL back
                });
            }
        );
        // Pipe the file buffer from multer to the Cloudinary upload stream
        uploadStream.end(file.buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during analysis.' });
    }
};

/**
 * @desc    Create a new listing after farmer confirmation
 * @route   POST /api/listings
 * @access  Private/Farmer
 */
export const createListing = async (req, res) => {
    // Data received from the frontend after farmer confirms the AI's analysis
    const { produceItem, quantity, unit, price, imageUrl } = req.body;

    if (!produceItem || !quantity || !unit || !price || !imageUrl) {
        return res.status(400).json({ message: 'All listing details are required.' });
    }

    try {
        const listing = new Listing({
            farmer: req.user._id, // from 'protect' middleware
            produceItem,
            quantity,
            unit,
            price, // This would be the confirmed price
            imageUrl,
            location: req.user.location, // Copy location from farmer's profile
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating listing.' });
    }
};
