import User from '../models/user.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user (farmer or buyer)
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = async (req, res) => {
  // Destructure all fields from the request body
  const { 
    name, email, password, userType, location,
    phone, village, district, state, pincode,
    aadhaar, landSize, produceTypes 
  } = req.body;

  // Core validation
  if (!name || !email || !password || !userType || !location) {
    return res.status(400).json({ message: 'Core user information is missing.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // Create the new user with all the provided data
    const user = await User.create({
      name,
      email,
      password,
      userType,
      location,
      phone,
      address: { village, district, state, pincode },
      aadhaar,
      landSize,
      produceTypes,
    });

    if (user) {
      generateToken(res, user._id); // Generate JWT and set cookie for auto-login
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists and if the password matches the hashed password
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id); // Generate JWT and set cookie

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Public
 */
export const logoutUser = (req, res) => {
    // To log out, we just clear the JWT cookie.
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiration date to the past
    });
    res.status(200).json({ message: 'Logged out successfully.' });
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    // The `protect` middleware already found the user and attached it to the request object.
    // req.user contains all the fields from the User model (except the password).
    const user = req.user;

    if (user) {
        // Send the complete user object back to the frontend.
        // This includes all the farmer-specific details.
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            phone: user.phone,
            address: user.address,
            aadhaar: user.aadhaar,
            landSize: user.landSize,
            produceTypes: user.produceTypes,
            location: user.location,
            createdAt: user.createdAt,
        });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
};
