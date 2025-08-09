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

app.use(cors({
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'https://veggie-help.vercel.app', // Production frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // If using cookies/auth tokens
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});