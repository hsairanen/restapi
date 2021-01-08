// Import frameworks and modules
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

// Initialize the framework
const app = express();

// Connect to the database
mongoose.connect(process.env.DATABASE_URL,{useUnifiedTopology: true,useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to the database.'))

// Body Parser Middleware
app.use(express.json());

// API Routes
const predictions = require('./routes/predictions')
app.use('/predictions', predictions)

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
