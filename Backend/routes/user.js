import express from 'express';
import { registerUser } from '../controllers/user.js';

// A router object is an isolated instance of middleware and routes.
const router = express.Router();

// When a POST request is made to the root of this router (which will be /api/users),
// the registerUser controller function will be executed.
router.post('/', registerUser);

export default router;