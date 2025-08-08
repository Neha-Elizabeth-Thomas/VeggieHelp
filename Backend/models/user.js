import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    // Core Fields
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['farmer', 'buyer', 'admin'], required: true },
    
    // Farmer-Specific Fields
    phone: { type: String },
    address: {
        village: { type: String },
        district: { type: String },
        state: { type: String },
        pincode: { type: String },
    },
    aadhaar: { type: String },
    landSize: { type: Number }, // in acres
    produceTypes: { type: [String], default: [] },
    
    // Location for Geospatial Queries
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
}, { timestamps: true });

// --- Middleware and Methods for Authentication ---
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ location: '2dsphere' });
const User = mongoose.model('User', userSchema);
export default User;