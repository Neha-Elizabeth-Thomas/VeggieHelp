// Import statements instead of require
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // The new way to load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware (this part stays the same)
app.use(cors());
app.use(express.json());

// --- Test Route ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working with ES Modules! 🎉' });
});

// Start the server (this part stays the same)
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});