import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'; // Import the new function

// --- Connect to Database ---
connectDB(); // Call the function to establish the connection

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());


// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});