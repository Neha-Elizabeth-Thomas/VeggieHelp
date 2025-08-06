// File: server/middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * @desc    Protect routes by verifying JWT
 */
export const protect = async (req, res, next) => {
    let token;
    // Read JWT from the http-only cookie
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the user by the ID from the token payload
            // .select('-password') ensures the hashed password is not returned
            req.user = await User.findById(decoded.userId).select('-password');
            
            // Proceed to the next middleware or controller
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

/**
 * @desc    Middleware to allow access only to farmers
 */
export const farmerOnly = (req, res, next) => {
    // This middleware must run AFTER the 'protect' middleware
    if (req.user && req.user.userType === 'farmer') {
        next(); // User is a farmer, proceed
    } else {
        // User is not a farmer, send forbidden error
        res.status(403).json({ message: 'Access denied. This route is for farmers only.' });
    }
};

/**
 * @desc    Middleware to allow access only to admins
 * @note    This assumes you have an 'isAdmin' boolean field in your User model.
 */
export const adminOnly = (req, res, next) => {
    // This middleware must run AFTER the 'protect' middleware
    if (req.user && req.user.userType === 'admin') {
        next(); // User is an admin, proceed
    } else {
        // User is not an admin, send forbidden error
        res.status(403).json({ message: 'Access denied. This route is for admins only.' });
    }
};
