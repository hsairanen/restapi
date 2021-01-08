// Import frameworks and modules
const express = require('express');

// Initialize the framework
const app = express();

// Create route handlers

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
