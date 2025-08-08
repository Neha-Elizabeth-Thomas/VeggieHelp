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
    // --- CORRECTED: Destructure all fields from the request body ---
    const { 
        produceItem, quantity, unit, price, imageUrl, 
        aiQualityAssessment, aiGeneratedAd 
    } = req.body;

    // Validation for core fields
    if (!produceItem) return res.status(400).json({ message: 'Produce item is missing.' });
    if (!quantity) return res.status(400).json({ message: 'Quantity is missing.' });
    if (!unit) return res.status(400).json({ message: 'Unit is missing.' });
    if (!price) return res.status(400).json({ message: 'Price is missing.' });
    if (!imageUrl) return res.status(400).json({ message: 'Image URL is missing.' });
    
    try {
        const listing = new Listing({
            farmer: req.user._id,
            produceItem,
            quantity,
            unit,
            price,
            imageUrl,
            location: req.user.location,
            // --- CORRECTED: Save the new AI fields to the database ---
            aiQualityAssessment,
            aiGeneratedAd,
        });
        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating listing.' });
    }
};

/**
 * @desc    Get listings for the logged-in farmer
 * @route   GET /api/listings/my-listings
 * @access  Private/Farmer
 */
export const getMyListings = async (req, res) => {
    try {
        // req.user._id is available from the 'protect' middleware.
        // This finds all listings where the 'farmer' field matches the logged-in user's ID.
        const listings = await Listing.find({ farmer: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching listings.' });
    }
};

export const getNearbyListings = async (req, res) => {
    try {
        const buyerLocation = req.user.location;
        // Search radius in meters (e.g., 10 kilometers)
        const searchRadius = 150 * 1000; 

        const nearbyListings = await Listing.find({
            status: 'available',
            location: {
                $near: {
                    $geometry: buyerLocation,
                    $maxDistance: searchRadius,
                },
            },
        }).populate('farmer', 'name'); // Also fetch the farmer's name

        res.status(200).json(nearbyListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching nearby listings.' });
    }
};
