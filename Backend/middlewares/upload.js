import multer from 'multer';

// Configure multer to store files in memory as buffers
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

export default upload;