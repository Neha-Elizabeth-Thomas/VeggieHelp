import mongoose from 'mongoose';

/**
 * Establishes a connection to the MongoDB database.
 */
const connectDB = async () => {
  try {
    // mongoose.connect returns a promise, so we await it.
    // process.env.MONGO_URI will fetch the connection string from your .env file.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log it to the console.
    console.log(`MongoDB Connected: ${conn.connection.host} 🔌`);
  } catch (error) {
    // If an error occurs, log the error and exit the process.
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;