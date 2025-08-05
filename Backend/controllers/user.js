import User from '../models/user.js';

/**
 * @desc    Register a new user (farmer or buyer)
 * @route   POST /api/users
 * @access  Public
 */
export const registerUser = async (req, res) => {
  // Extract data from the request body
  const { name,email, userType, location } = req.body;

  // Basic validation
  if (!name ||!email || !userType || !location || !location.coordinates) {
    return res.status(400).json({ message: 'Please provide all required fields: name, userType, and location with coordinates.' });
  }

  try {
    // Check if a user with the same name and type already exists to prevent duplicates
    const userExists = await User.findOne({ email, userType });

    if (userExists) {
      return res.status(409).json({ message: 'A user with this name and role already exists.' });
    }

    // Create a new user instance using the User model
    const user = await User.create({
      name,
      email,
      userType,
      location,
    });

    // If the user is created successfully, send back the user's data
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email:user.email,
        userType: user.userType,
        location: user.location,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during user registration.' });
  }
};