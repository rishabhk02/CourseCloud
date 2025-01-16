// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// Import custom modules for database connection and cloudinary configuration
const connectDB = require('./config/mongoConnection');
const cloudinaryConnect = require("./config/cloudinary");
const mainRouter = require('./mainRouter');

// Set the port to the value from environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Connect to the database
connectDB();

// Connect to Cloudinary for file uploads
cloudinaryConnect();

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) with specific configurations
app.use(
    cors({
        origin: "*", // Allow all origins for CORS
        credentials: true,
    })
);

// Middleware to handle file uploads with temporary files storage
app.use(
    fileUpload({
        useTempFiles: true, // Use temporary files for uploads
        tempFileDir: "/temp/", // Directory for temporary files
    })
);

// Use the mainRouter for handling routes under the /api/v1 path
app.use('/api/v1', mainRouter);

// Route to test if the server is running
app.get("/", (req, res) => {
    return res.status(200).json({ success: true, message: "Hi, How its going..." });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
