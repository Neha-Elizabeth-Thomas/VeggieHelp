// File: client/src/services/api.js

import axios from 'axios';

// Create a new instance of axios with a custom configuration
const api = axios.create({
  // The baseURL will be read from the .env file.
  // The Vite proxy will handle forwarding this to your backend server.
  baseURL: 'http://localhost:3000/api',
  // This is crucial for sending the httpOnly JWT cookie back and forth
  withCredentials: true, 
});

export default api;
