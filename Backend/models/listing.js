import mongoose from 'mongoose';

// This schema stores the produce listings created by farmers.
const listingSchema = new mongoose.Schema({
    // This creates a direct link to the User who created the listing.
    // 'ref' tells Mongoose which model to use during population.
    farmer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    produceItem: { 
        type: String, 
        required: true,
        lowercase: true // Store in lowercase for easier matching
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    unit: { 
        type: String, // e.g., 'kg', 'pieces', 'dozen'
        required: true,
        lowercase: true
    },
    status: { 
        type: String, 
        enum: ['available', 'sold'], 
        default: 'available' 
    },
    // We duplicate the location here from the farmer's profile.
    // This denormalization makes querying for nearby listings much faster.
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { 
    timestamps: true 
});

// Add the 2dsphere index here as well for fast location-based searches on listings.
listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;