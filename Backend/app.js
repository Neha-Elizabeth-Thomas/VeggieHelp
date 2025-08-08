import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'; // Import the new function
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/index.js';

// --- Connect to Database ---
connectDB(); // Call the function to establish the connection

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  // This must be the exact origin of your frontend application
  origin: 'http://localhost:5173', 
  // This is crucial for allowing cookies to be sent with requests
  credentials: true, 
};

// 3. Use the cors middleware with your options
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});