import mongoose from 'mongoose';

// This schema stores the produce listings created by farmers.
const listingSchema = new mongoose.Schema({
    // Core listing data
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    produceItem: { type: String, required: true, lowercase: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, lowercase: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },

    // --- NEW: AI-Generated Fields ---
    aiQualityAssessment: { type: String },
    aiGeneratedAd: { type: String },

}, { 
    timestamps: true 
});


// Add the 2dsphere index here as well for fast location-based searches on listings.
listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;