import mongoose from 'mongoose';

// This schema will store information for both farmers and buyers.
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
    email: { // Add email
        type: String,
        required: true,
        unique: true, // Ensure no two users share an email
        lowercase: true
    },
    // 'userType' helps us differentiate between the two types of users.
    userType: { 
        type: String, 
        enum: ['farmer', 'buyer','admin'], // The value must be one of these two options
        required: true 
    },
    // We use the GeoJSON Point format for efficient location queries.
    // This is crucial for finding nearby users.
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers: [longitude, latitude]
            required: true
        }
    },
    password: { type: String, required: true },
    // This field is only relevant for buyers.
    needs: {
        type: [String], // An array of strings, e.g., ["tomato", "onion"]
        default: []
    }
}, { 
    // Automatically adds `createdAt` and `updatedAt` fields.
    timestamps: true 
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
// This special index is required by MongoDB to perform geospatial queries.
userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

export default User;